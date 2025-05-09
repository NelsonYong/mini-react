# react 源码解析

## 模块简介

`react` 包实现了 React 的核心 API，包括 JSX 转换、hooks 机制等，是整个 mini-react 的基础。

## 主要文件
- `index.ts`：导出核心 API。
- `src/jsx.ts`：JSX 转换相关实现。
- `src/currentDispatcher.ts`：hooks dispatcher 实现。
- `shared.ts`：共享类型和工具。

## 实现思路
- 通过 `jsx` 方法将 JSX 语法转换为虚拟 DOM 对象。
- 利用 dispatcher 管理 hooks 的调用和状态。
- 设计与 React 兼容的 API，便于渐进式学习。

> 详细源码请参考各文件注释。 