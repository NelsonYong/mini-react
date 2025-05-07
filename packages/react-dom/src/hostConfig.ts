/* eslint-disable @typescript-eslint/no-explicit-any */

export type Container =
  | (Element)
  | (Document)
  | (DocumentFragment);

export type Instance = Container;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createInstance = (type: string, props: any): Instance => {
  // TODO: 处理 props
  const element = document.createElement(type);
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