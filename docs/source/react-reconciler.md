# react-reconciler 源码解析

## 模块简介

`react-reconciler` 是 React 的核心调度与协调模块，负责 Fiber 架构、任务调度、更新流程等。

## 主要文件
- `src/childFiber.ts`：子 Fiber 节点的创建与管理。
- `src/commitWork.ts`：提交阶段的 DOM 操作。
- `src/workLoop.ts`：调度循环与任务分片。
- `src/fiber.ts`：Fiber 节点结构定义。
- `src/fiberHooks.ts`：hooks 相关实现。
- 其他：beginWork、completeWork、fiberFlags、fiberLanes、updateQueue 等。

## 实现思路
- 采用 Fiber 架构，实现可中断的任务调度。
- 区分 render 阶段与 commit 阶段，提升性能。
- 支持 hooks、优先级、批量更新等特性。

> 详细源码请参考各文件注释。 