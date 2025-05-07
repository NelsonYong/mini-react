import { Props } from "shared";


export const elementPropsKey = '__props';

export interface DOMElement extends Element {
  [elementPropsKey]: Props;
}

// 将事件的回调保存在 DOM 中
export function updateFiberProps(node: DOMElement, props: Props) {
  node[elementPropsKey] = props;
}
