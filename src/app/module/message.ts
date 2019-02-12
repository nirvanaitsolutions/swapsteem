export interface MessageRequest {  
    createdby: string,
    ad_id:string
    createdfor:string
    message_type:string,
    message_text:string,
    order_id:string
}

export interface MessageResponse {
    _id : string  
    createdby: string,
    ad_id:string
    createdfor:string
    order_type:string,
    order_coin_amount:number,
    order_fiat_amount:number,
    order_coin:string,
    order_rate:number,
    order_payment_method: string[],
    agree_terms: true,
    order_status:string,
    country:string,
    from:string
}