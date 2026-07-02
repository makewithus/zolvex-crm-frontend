export interface ServiceArea {
  id: string;
  name: string;
  is_active: boolean;
}

export interface City {
  id: string;
  name: string;
  is_active: boolean;
  serviceAreas?: ServiceArea[];
}

export interface CitiesResponse {
  status: string;
  message: string;
  data: City[];
}

export interface CreateCityResponse {
  status: string;
  message: string;
  data: {
    id: string;
  };
}
