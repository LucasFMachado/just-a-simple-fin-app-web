export interface IGetResponse<Entity> {
  hasError: boolean;
  data?: Entity;
  message: string;
}

export interface IGetListResponse<Entity> {
  list: Entity[];
  count: number;
}
