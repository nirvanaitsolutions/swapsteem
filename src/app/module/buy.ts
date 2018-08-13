export interface buyRequest{
        ad_id: String;
        createdby : String;
        createdfor : String;
        order_type: String;
        order_coin_amount: String;
        order_coin : String;
        order_rate : String;
        order_payment_method : String;
        agree_terms : Boolean;
        country : String;
        currency : String;
} 

export interface buyResponse{
        ad_id: String;
        createdby : String;
        createdfor : String;
        order_type: String;
        order_coin_amount: String;
        order_coin : String;
        order_rate : String;
        order_payment_method : String;
        agree_terms : Boolean;
        country : String;
        currency : String;
} 