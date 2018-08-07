export interface Advertisement {
    createdby: string,
    ad_type: string,
    country: string,
    payment_methods: string[],
    currency: string,
    margin: string,
    limit_from: string,
    limit_to: string,
    restricted_amounts: string[],
    ad_coin : string,
    ad_coin_amount : string,
    terms: string,
    ad_details:{
      minimum_volume: string,
      minimum_reputation_score: string,
      new_buyer_limit: string,
      track_liquidity: Boolean
    },
    security_details:{
      identified_people_only: Boolean,
      identify_user_before_continuing_trade:Boolean,
      real_name_required:Boolean,
      sms_verification_required: Boolean,
      trusted_people_only: Boolean
    }
}