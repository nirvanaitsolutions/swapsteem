export interface OrderRequest {
    createdby: string,
    ad_id: string
    createdfor: string
    order_type: string,
    escrowID: number,
    order_coin_amount: number,
    order_fiat_amount: number,
    from: string,
    to: string,
    market: string,
    order_rate: number,
    order_payment_method: string | string[],
    agree_terms: true,
    order_status: string,
    escrow_rat_deadline: Date;
    escrow_exp_deadline: Date;
    // payment_details?: {
    //     account_holder_name?: string;
    //     account_number?: number;
    //     bank_name?: string;
    //     bank_address?: string;
    //     swift_bic_code?: string;
    //     bank_code?: string;
    //     paypal_email?: string;
    //     place_of_exchange?: string;
    //     upi_id?:string;
    //     crypto_address?:string;
    //}
}

export interface OrderResponse {
    _id: string
    createdby: string,
    ad_id: string,
    createdfor: string,
    escrowID: number,
    order_type: string,
    order_coin_amount: number,
    from: string,
    to: string,
    market: string,
    order_rate: number,
    order_payment_method: string[] | string,
    agree_terms: true,
    order_status: string,
    country: string,
    escrow_rat_deadline?: Date;
    escrow_exp_deadline?: Date;
    payment_details?: {
        account_holder_name?: string;
        account_number?: number;
        bank_name?: string;
        bank_address?: string;
        swift_bic_code?: string;
        bank_code?: string;
        paypal_email?: string;
        place_of_exchange?: string;
        upi_id?:string;
        crypto_address?:string;
    }
}