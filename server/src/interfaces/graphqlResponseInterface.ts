export interface GraphqlResponseParamsInterface<T> {
  message: string;
  data?: T;
}

export interface GraphqlMessageResponseInterface {
  message: string;
}

export interface GraphqlResponseInterface<
  T,
> extends GraphqlMessageResponseInterface {
  data?: T;
}
