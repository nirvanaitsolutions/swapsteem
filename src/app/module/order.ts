export interface OrderRequest {  
    createdby: string,
    ad_id:string
    createdfor:string
    order_type:string,
    escrowID:number,
    order_coin_amount:number,
    order_fiat_amount:number,
    order_coin:string,
    order_rate:number,
    order_payment_method: string[],
    agree_terms: true,
    order_status:string,
    country:string,
    currency:string
}

export interface OrderResponse {
    _id : string  
    createdby: string,
    ad_id:string,
    createdfor:string,
    escrowID:number,
    order_type:string,
    order_coin_amount:number,
    order_coin:string,
    order_rate:number,
    order_payment_method: string[],
    agree_terms: true,
    order_status:string,
    country:string,
    currency:string
}