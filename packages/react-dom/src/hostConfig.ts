/* eslint-disable @typescript-eslint/no-explicit-any */

import { HostComponent, HostText } from "react-reconciler/src/workTags";
import { DOMElement, updateFiberProps } from "./SyntheticEvent";
import { FiberNode } from "react-reconciler/src/fiber";

export type Container =
  | (Element)
  | (Document)
  | (DocumentFragment);

export type Instance = Container;

export type TextInstance = Text;



export const createInstance = (type: string, props: any): Instance => {
  // TODO: 处理 props
  const element = document.createElement(type);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  updateFiberProps(element as DOMElement, props);
  return element;
};

export const appendInitialChild = (
  parent: Instance | Container,
  child: Instance
) => {
  parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
  const element = document.createTextNode(content);
  return element;
};

export const appendChildToContainer = (
  child: Instance,
  parent: Instance | Container
) => {
  parent.appendChild(child);
};

export const commitUpdate = (fiber: FiberNode) => {
  if (__DEV__) {
    console.log('执行 Update 操作', fiber);
  }
  switch (fiber.tag) {
    case HostComponent:
      return updateFiberProps(fiber.stateNode, fiber.memoizedProps);
    case HostText:
      const text = fiber.memoizedProps.content;
      commitTextUpdate(fiber.stateNode, text);
      break;
    default:
      if (__DEV__) {
        console.warn('未实现的 commitUpdate 类型', fiber);
      }
  }
};


export const commitTextUpdate = (
  textInstance: TextInstance,
  content: string
) => {
  textInstance.textContent = content;
};

export const removeChild = (
  child: Instance | TextInstance,
  container: Container
) => {
  container.removeChild(child);
};
