export interface OrderRequest {
    createdby: string,
    ad_id: string
    createdfor: string
    order_type: string,
    escrowID: number,
    order_coin_amount: number,
    order_fiat_amount: number,
    order_coin: string,
    order_rate: number,
    order_payment_method: string[],
    agree_terms: true,
    order_status: string,
    country: string,
    currency: string,
    escrow_rat_deadline: Date;
    escrow_exp_deadline: Date;
    payment_details?: {
        account_holder_name: string;
        account_number: number;
        bank_name: string;
        bank_address?: string;
        swift_bic_code?: string;
        bank_code: string;
      }
}

export interface OrderResponse {
    _id: string
    createdby: string,
    ad_id: string,
    createdfor: string,
    escrowID: number,
    order_type: string,
    order_coin_amount: number,
    order_coin: string,
    order_rate: number,
    order_payment_method: string[],
    agree_terms: true,
    order_status: string,
    country: string,
    currency: string
    escrow_rat_deadline?: Date;
    escrow_exp_deadline?: Date;
    payment_details?: {
        account_holder_name: string;
        account_number: number;
        bank_name: string;
        bank_address?: string;
        swift_bic_code?: string;
        bank_code: string;
      }
}