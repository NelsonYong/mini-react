
export type Flags = number;

/**
 * react 中的 fiber 节点的状态
 * 1. 表示节点的变更类型
 * 2. 表示节点的子节点是否需要创建或删除
 * 3. 表示节点的子节点是否需要更新
 * 4. 表示节点的子节点是否需要插入
 * 5. 表示节点的子节点是否需要删除
 */
export const NoFlags = 0b0000000;
export const PerformedWork = 0b0000001;
export const Placement = 0b0000010;
export const Update = 0b0000100;
export const ChildDeletion = 0b0001000;

export const MutationMask = Placement | Update | ChildDeletion;
