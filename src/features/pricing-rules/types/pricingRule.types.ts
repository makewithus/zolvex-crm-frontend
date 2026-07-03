export interface PricingRule {
  id: string;
  service_id: string;
  city_id?: string | null;
  bhk_type?: string | null;
  tank_size?: string | null;
  base_price: number;
  cgst_percent?: number;
  sgst_percent?: number;
  igst_percent?: number;
  service?: {
    id: string;
    name: string;
  };
  city?: {
    id: string;
    name: string;
  };
}

export interface PricingRulesResponse {
  status: string;
  message: string;
  data: PricingRule[];
}

export interface CreatePricingRuleResponse {
  status: string;
  message: string;
  data: {
    id: string;
  };
}
