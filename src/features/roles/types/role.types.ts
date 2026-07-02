export interface Role {
  id: string;
  name: string;
}

export interface RolesResponse {
  status: string;
  message: string;
  data: Role[];
}
