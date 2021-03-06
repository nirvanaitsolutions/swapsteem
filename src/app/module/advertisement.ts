export interface AdvertisementRequest {
  createdby: string,
  ad_type: string,
  market: string,
  payment_method: string,
  margin: number,
  limit_from: number,
  limit_to: number,
  restricted_amounts: string[],
  from: string,
  to: string,
  ad_coin_amount:number,
  ad_status: string,
  terms: string,
  // ad_details: {
  //   minimum_volume: Number,
  //   minimum_reputation_score: Number,
  //   new_buyer_limit: Number,
  //   track_liquidity: Boolean
  // },
  // security_details: {
  //   identified_people_only: Boolean,
  //   identify_user_before_continuing_trade: Boolean,
  //   real_name_required: Boolean,
  //   sms_verification_required: Boolean,
  //   trusted_people_only: Boolean
  // },
  // payment_details?: {
  //   account_holder_name?: string;
  //   account_number?: number;
  //   bank_name?: string;
  //   bank_address?: string;
  //   swift_bic_code?: string;
  //   bank_code?: string;
  //   paypal_email?: string;
  //   place_of_exchange?: string;
  //   upi_id?:string;
  //   crypto_address?:string;
  // }
}

export interface AdvertisementResponse {
  _id: string
  createdby: string,
  ad_type: string,
  market: string,
  payment_method: string,
  to: string,
  margin: number,
  limit_from: number,
  ad_status: string,
  limit_to: number,
  restricted_amounts: string[],
  from: string,
  ad_coin_amount: number,
  terms: string,
  __v: Number,
  // ad_details: {
  //   minimum_volume: Number,
  //   minimum_reputation_score: Number,
  //   new_buyer_limit: Number,
  //   track_liquidity: Boolean
  // },
  // security_details: {
  //   identified_people_only: Boolean,
  //   identify_user_before_continuing_trade: Boolean,
  //   real_name_required: Boolean,
  //   sms_verification_required: Boolean,
  //   trusted_people_only: Boolean
  // },
  // payment_details?: {
  //   account_holder_name?: string;
  //   account_number?: number;
  //   bank_name?: string;
  //   bank_address?: string;
  //   swift_bic_code?: string;
  //   bank_code?: string;
  //   paypal_email?: string;
  //   place_of_exchange?: string;
  //   upi_id?:string;
  //   crypto_address?:string
  // },
}
