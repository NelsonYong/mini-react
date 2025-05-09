import { Key, Props, ReactElementType } from 'shared/ReactTypes';
import {
  FiberNode,
  createFiberFromElement,
  createFiberFromFragment,
  createWorkInProgress
} from './fiber';
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from 'shared/ReactSymbols';
import { Fragment, HostText } from './workTags';
import { ChildDeletion, Placement } from './fiberFlags';

type ExistingChildren = Map<string | number, FiberNode>;

function ChildReconciler(shouldTrackSideEffects: boolean) {
  // 从父节点中删除指定的子节点
  function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode): void {
    if (!shouldTrackSideEffects) {
      return;
    }
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  // 删除当前节点的所有兄弟节点
  function deleteRemainingChildren(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null
  ): void {
    if (!shouldTrackSideEffects) return;
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
  }

  // 复用 Fiber 节点
  function useFiber(fiber: FiberNode, pendingProps: Props): FiberNode {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  // 处理单个 Element 节点的情况
  // 对比 currentFiber 与 ReactElement，生成 workInProgress FiberNode
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType
  ) {
    // 组件的更新阶段
    while (currentFiber !== null) {
      if (currentFiber.key === element.key) {
        if (element.$$typeof === REACT_ELEMENT_TYPE) {
          if (currentFiber.type === element.type) {
            // key 和 type 都相同，当前节点可以复用旧的 Fiber 节点
            // 处理 Fragment 的情况
            let props: Props = element.props;
            if (element.type === REACT_FRAGMENT_TYPE) {
              props = element.props.children;
            }

            const existing = useFiber(currentFiber, props);
            existing.return = returnFiber;
            // 剩下的兄弟节点标记删除
            deleteRemainingChildren(returnFiber, currentFiber.sibling);
            return existing;
          }
          // key 相同，但 type 不同，删除所有旧的 Fiber 节点
          deleteRemainingChildren(returnFiber, currentFiber);
          break;
        } else {
          if (__DEV__) {
            console.warn('还未实现的 React 类型', element);
            break;
          }
        }
      } else {
        // key 不同，删除当前旧的 Fiber 节点，继续遍历兄弟节点
        deleteChild(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
      }
    }

    // 创建新的 Fiber 节点
    let fiber;
    if (element.type === REACT_FRAGMENT_TYPE) {
      fiber = createFiberFromFragment(element.props.children, element.key);
    } else {
      fiber = createFiberFromElement(element);
    }
    fiber.return = returnFiber;
    return fiber;
  }

  // 处理文本节点的情况
  // 对比 currentFiber 与 ReactElement，生成 workInProgress FiberNode
  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number
  ) {
    while (currentFiber !== null) {
      // 组件的更新阶段
      if (currentFiber.tag === HostText) {
        // 复用旧的 Fiber 节点
        const existing = useFiber(currentFiber, { content });
        existing.return = returnFiber;
        deleteRemainingChildren(returnFiber, currentFiber.sibling);
        return existing;
      } else {
        // 删除旧的 Fiber 节点
        deleteChild(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
      }
    }
    // 创建新的 Fiber 节点
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeChild(
    newFiber: FiberNode,
    lastPlacedIndex: number,
    newIndex: number,
  ): number {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
      // Noop.
      return lastPlacedIndex;
    }
    const current = newFiber.alternate;
    if (current !== null) {
      const oldIndex = current.index;
      if (oldIndex < lastPlacedIndex) {
        // This is a move.
        newFiber.subtreeFlags = Placement;
        return lastPlacedIndex;
      } else {
        // This item can stay in place.
        return oldIndex;
      }
    } else {
      // This is an insertion.
      newFiber.subtreeFlags = Placement;
      return lastPlacedIndex;
    }
  }

  // 为 Fiber 节点添加更新 flags
  function placeSingleChild(fiber: FiberNode) {
    // 首屏渲染且追踪副作用时，才添加更新 flags
    if (shouldTrackSideEffects && fiber.alternate == null) {
      fiber.flags |= Placement;
    }
    return fiber;
  }

  function createChild(
    returnFiber: FiberNode,
    newChild: any
  ): FiberNode | null {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // 纯文本节点
      const fiber = new FiberNode(HostText, { content: String(newChild) }, null);
      fiber.return = returnFiber;
      return fiber;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (newChild.type === REACT_FRAGMENT_TYPE) {
            // Fragment
            const fiber = createFiberFromFragment(newChild.props.children, newChild.key);
            fiber.return = returnFiber;
            return fiber;
          }
          // 普通 ReactElement
          const fiber = createFiberFromElement(newChild);
          fiber.return = returnFiber;
          return fiber;
        default:
          // 其他类型暂不处理
          return null;
      }
    }

    // 其他类型（如 null、undefined、boolean）直接跳过
    return null;
  }

  function reconcileChildrenArrayV2(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChildren: any[],
  ): FiberNode | null {

    let resultingFirstChild: FiberNode | null = null;
    let previousNewFiber: FiberNode | null = null;

    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    // 1. 将 current 中所有同级 Fiber 节点保存在 Map 中
    const existingChildren: ExistingChildren = new Map();
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber?.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber?.sibling;
      }
      const newFiber = updateFromMap(
        returnFiber,
        existingChildren,
        newIdx,
        newChildren[newIdx]
      );
      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }
      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx]);
        if (newFiber === null) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      return resultingFirstChild;
    }



    // Keep scanning and use the map to restore deleted items as moves.
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        returnFiber,
        existingChildren,

        newIdx,
        newChildren[newIdx],
      );
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key,
            );
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    return resultingFirstChild;
  }

  function reconcileChildrenArray(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChild: any[]
  ) {
    // 最后一个可复用 Fiber 在 current 中的 index
    let lastPlacedIndex: number = 0;
    // 创建的第一个新 Fiber
    let firstNewFiber: FiberNode | null = null;
    // 创建的最后一个新 Fiber
    let lastNewFiber: FiberNode | null = null;

    // 1. 将 current 中所有同级 Fiber 节点保存在 Map 中
    const existingChildren: ExistingChildren = new Map();
    let current = currentFirstChild;
    while (current !== null) {
      const keyToUse =
        current?.key !== null ? current.key : current.index.toString();
      existingChildren.set(keyToUse, current);
      current = current.sibling;
    }

    // 2. 遍历 newChild 数组，判断是否可复用
    for (let i = 0; i < newChild.length; i++) {
      const after = newChild[i];
      const keyToUse = (after && after.key != null) ? after.key : i.toString();
      const newFiber = updateFromMap(returnFiber, existingChildren, i, after);

      if (newFiber == null) {
        // 修复点：如果 newFiber 为 null，且 existingChildren 里有 keyToUse，说明该位置的旧 fiber 没被复用，应该从 Map 删除
        if (existingChildren.has(keyToUse)) {
          existingChildren.delete(keyToUse);
        }
        continue;
      }

      // 3. 标记插入或移动
      newFiber.index = i;
      newFiber.return = returnFiber;

      if (lastNewFiber == null) {
        lastNewFiber = newFiber;
        firstNewFiber = newFiber;
      } else {
        lastNewFiber.sibling = newFiber;
        lastNewFiber = lastNewFiber.sibling;
      }

      if (!shouldTrackSideEffects) {
        continue;
      }

      const current = newFiber.alternate;
      if (current !== null) {
        const oldIndex = current.index;
        if (oldIndex < lastPlacedIndex) {
          // 标记移动
          newFiber.flags |= Placement;
          continue;
        } else {
          // 不移动
          lastPlacedIndex = oldIndex;
        }
      } else {
        // 新节点，标记插入
        newFiber.flags |= Placement;
      }
    }

    // 4. 将 Map 中剩下的标记为删除
    // 修复点：确保 updateFromMap 复用 fiber 后一定 existingChildren.delete(keyToUse)
    // 如果 updateFromMap 没有做，需要在这里补充
    existingChildren.forEach((fiber, key) => {
      deleteChild(returnFiber, fiber);
    });

    console.log({
      firstNewFiber
    });

    return firstNewFiber;
  }

  function updateFromMap(
    returnFiber: FiberNode,
    existingChildren: ExistingChildren,
    index: number,
    element: any
  ): FiberNode | null {
    const keyToUse = element.key !== null ? element.key : index.toString();
    const before = existingChildren.get(keyToUse);

    // HostText
    if (typeof element === 'string' || typeof element === 'number') {
      // 可复用，复用旧的 Fiber 节点
      if (before && before.tag === HostText) {
        existingChildren.delete(keyToUse);
        return useFiber(before, { content: element + '' });
      }
      // 不可复用，创建新的 Fiber 节点
      return new FiberNode(HostText, { content: element + '' }, null);
    }

    // ReactElement
    if (typeof element === 'object' && element !== null) {
      switch (element.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (element.type === REACT_FRAGMENT_TYPE) {
            return updateFragment(
              returnFiber,
              before,
              element,
              keyToUse,
              existingChildren
            );
          }
          // 可复用，复用旧的 Fiber 节点
          if (before && before.type === element.type) {
            existingChildren.delete(keyToUse);
            return useFiber(before, element.props);
          }
          // 不可复用，创建新的 Fiber 节点
          return createFiberFromElement(element);

        // TODO case REACT_FRAGMENT_TYPE
        default:
          break;
      }
    }

    // 数组类型的 ReactElement，如：<ul>{[<li/>, <li/>]}</ul>
    if (Array.isArray(element)) {
      return updateFragment(
        returnFiber,
        before,
        element,
        keyToUse,
        existingChildren
      );
    }

    return null;
  }

  // 闭包，根绝 shouldTrackSideEffects 返回不同 reconcileChildFibers 的实现
  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: any
  ) {
    // 判断 Fragment
    const isUnkeyedTopLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;
    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    }

    // 判断当前 fiber 的类型
    // ReactElement 节点
    if (typeof newChild == 'object' && newChild !== null) {
      // 处理多个 ReactElement 节点的情况
      if (Array.isArray(newChild)) {
        // 深拷贝一份 returnFiber，currentFiber newChild

        // const returnFiberClone = { ...returnFiber };
        // const currentFiberClone = { ...currentFiber };
        // const newChildClone = [...newChild];

        // console.log("currentFiberClone", currentFiber);

        // console.log({
        //   reconcileChildrenArrayV2: reconcileChildrenArrayV2(returnFiberClone, currentFiberClone!, newChildClone),
        //   // reconcileChildrenArray: reconcileChildrenArray(returnFiberClone, currentFiberClone!, newChildClone)
        // });

        return reconcileChildrenArray(returnFiber, currentFiber, newChild);
      }

      // 处理单个 ReactElement 节点的情况
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild)
          );

        default:
          if (__DEV__) {
            console.warn('未实现的 reconcile 类型', newChild);
          }
          break;
      }
    }

    // 文本节点
    if (typeof newChild == 'string' || typeof newChild == 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild)
      );
    }

    // default 情况，删除旧的 Fiber 节点
    if (currentFiber !== null) {
      deleteRemainingChildren(returnFiber, currentFiber);
    }

    if (__DEV__) {
      console.warn('未实现的 reconcile 类型', newChild);
    }
    return null;
  };

  // 复用或新建 Fragment
  function updateFragment(
    returnFiber: FiberNode,
    current: FiberNode | undefined,
    elements: any[],
    key: Key,
    existingChildren: ExistingChildren
  ) {
    let fiber;
    if (!current || current.tag !== Fragment) {
      fiber = createFiberFromFragment(elements, key);
    } else {
      existingChildren.delete(key);
      fiber = useFiber(current, elements);
    }
    fiber.return = returnFiber;
    return fiber;
  }
}

// 组件的更新阶段中，追踪副作用
export const reconcileChildFibers = ChildReconciler(true);

// 首屏渲染阶段中不追踪副作用，只对根节点执行一次 DOM 插入操作
export const mountChildFibers = ChildReconciler(false);
