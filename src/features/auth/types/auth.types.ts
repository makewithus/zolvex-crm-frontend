export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      phone: string;
      role: {
        id: string;
        name: string;
      };
      city_id?: string;
    };
  };
}
