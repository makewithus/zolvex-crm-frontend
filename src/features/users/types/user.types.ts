export interface User {
  id: string;
  name: string;
  phone: string;
  role: {
    id: string;
    name: string;
  };
  city?: {
    id: string;
    name: string;
  };
  is_active: boolean;
  joining_date?: string;
  skill_tags: string[];
}

export interface UsersResponse {
  status: string;
  message: string;
  data: User[];
}

export interface CreateUserResponse {
  status: string;
  message: string;
  data: {
    id: string;
  };
}
