// packages/react-reconciler/src/completeWork.ts
import {
  appendInitialChild,
  createInstance,
  createTextInstance,
  Container,
  Instance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

// 生成更新计划，计算和收集更新 flags
export const completeWork = (workInProgress: FiberNode) => {
  const newProps = workInProgress.pendingProps;
  const current = workInProgress.alternate;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      return null;

    case HostComponent:
      if (current !== null && workInProgress.stateNode !== null) {
        // TODO: 组件的更新阶段
      } else {
        // 首屏渲染阶段
        // 构建 DOM
        const instance = createInstance(workInProgress.type, newProps);
        // 将 DOM 插入到 DOM 树中
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
      }
      // 收集更新 flags
      bubbleProperties(workInProgress);
      return null;

    case HostText:
      if (current !== null && workInProgress.stateNode !== null) {
        // TODO: 组件的更新阶段
      } else {
        // 首屏渲染阶段
        // 构建 DOM
        const instance = createTextInstance(newProps.content);
        workInProgress.stateNode = instance;
      }
      // 收集更新 flags
      bubbleProperties(workInProgress);
      return null;

    default:
      if (__DEV__) {
        console.warn('completeWork 未实现的类型', workInProgress);
      }
      return null;
  }
};

function appendAllChildren(
  parent: Container | Instance,
  workInProgress: FiberNode
) {
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag == HostComponent || node.tag == HostText) {
      // 处理原生 DOM 元素节点或文本节点
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 递归处理其他类型的组件节点的子节点
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node == workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    // 处理下一个兄弟节点
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

// 收集更新 flags，将子 FiberNode 的 flags 冒泡到父 FiberNode 上
function bubbleProperties(workInProgress: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = workInProgress.child;
  while (child !== null) {
    // 收集子 FiberNode 的 flags 进行合并，为什么使用位运算，举个例子：
    // 1. 子 FiberNode 的 flags 是 Placement，那么 subtreeFlags 就是 Placement
    // 2. 子 FiberNode 的 flags 是 Placement 和 Update，那么 subtreeFlags 就是 Placement | Update
    // 3. 子 FiberNode 的 flags 是 Placement、Update 和 Deletion，那么 subtreeFlags 就是 Placement | Update | Deletion
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child.return = workInProgress;
    child = child.sibling;
  }

  workInProgress.subtreeFlags |= subtreeFlags;
}
