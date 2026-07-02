export interface Role {
  id: string;
  name: string;
  _count?: {
    users: number;
  };
}

export interface RolesResponse {
  status: string;
  message: string;
  data: Role[];
}
