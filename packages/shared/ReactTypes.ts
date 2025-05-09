/* eslint-disable @typescript-eslint/no-explicit-any */
export type Type = any;
export type Key = any;
export type Props = any;
export type Ref = any;
export type ElementType = any;

export interface ReactElementType {
  $$typeof: symbol | number;
  key: Key;
  props: Props;
  ref: Ref;
  type: ElementType;
  __mark: string;
}

export type Action<State> = State | ((prevState: State) => State);


export type Source = {
  fileName: string;
  lineNumber: number;
};

export type ReactElement = ReactElementType
export type ReactNode = ReactElement | ReactText | ReactFragment;

export type ReactEmpty = null | void | boolean;

export type ReactFragment = ReactEmpty | Iterable<ReactNode>;

export type ReactNodeList = ReactEmpty | ReactNode;

export type ReactText = string | number;