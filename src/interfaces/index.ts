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

export interface IType {
  id: string;
  title: string;
  active: boolean;
  created_at: string;
}

export interface ICategory {
  id: string;
  title: string;
  type_id: string;
  type: IType;
  active: boolean;
  created_at: string;
}

export interface ITransaction {
  id: string;
  title: string;
  category_id: string;
  amount: string;
  created_at: string;
}
