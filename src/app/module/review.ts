export interface ReviewRequest {
    createdby: string;
    ad_id: string;
    createdfor: string
    order_id: string;
    review_score: number;
    review_text: string;
}

export interface ReviewResponse {
    ad_id: string;
    createdAt: string;
    createdby: string;
    createdfor: string;
    order_id: string;
    review_score: number;
    review_text: string;
    updatedAt: string
    __v: number
    _id: string;
}