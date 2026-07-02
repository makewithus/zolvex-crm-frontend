export interface Service {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  is_active: boolean;
}

export interface ServicesResponse {
  status: string;
  message: string;
  data: Service[];
}

export interface CreateServiceResponse {
  status: string;
  message: string;
  data: {
    id: string;
  };
}
