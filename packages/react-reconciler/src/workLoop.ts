import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root.current);
  try {
    workLoop();
  } catch (e) {
    console.warn('workLoop发生错误：', e);
    workInProgress = null;
  }
}

// 初始化 workInProgress 变量
function prepareFreshStack(root: FiberNode) {
  workInProgress = createWorkInProgress(root, {});
}

// 深度优先遍历，向下递归子节点
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  // console.log("fiber", fiber);
  // debugger
  // 比较并返回子 FiberNode
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;
  if (next == null) {
    // 没有子节点，则遍历兄弟节点或父节点
    completeUnitOfWork(fiber);
  } else {
    // 有子节点，继续向下深度遍历
    workInProgress = next;
  }
}

// 深度优先遍历兄弟节点或父节点
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;
  do {
    // 生成更新计划
    completeWork(node);
    // 有兄弟节点，则遍历兄弟节点
    const sibling = node.sibling;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    // 否则向上返回，遍历父节点
    node = node.return;
    // workInProgress 最终指向根节点
    workInProgress = node;
  } while (node !== null);
}

// 调度功能
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  console.log("fiber", fiber);

  const root = markUpdateFromFiberToRoot(fiber);
  console.log("root", root);

  renderRoot(root);
}

// 从触发更新的节点向上遍历到 FiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;

  while (node.return !== null) {
    node = node.return;
  }
  if (node.tag == HostRoot) {
    return node.stateNode;
  }
  return null;
}

