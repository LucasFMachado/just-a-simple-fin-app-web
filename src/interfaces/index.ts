export interface IGetResponse<Entity> {
  hasError: boolean;
  data?: Entity;
  message: string;
}

export interface IGetListResponse<Entity> {
  list: Entity[];
  count: number;
}

export interface IOption {
  value: string;
  label: string;
}
export interface IGetOptionsResponse {
  options: IOption[];
}
