import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EscrowService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  public broadcastEscrowTransfer(data){
    this.document.location.href = this.getEscrowURL('escrow_transfer',data);
  }
  public broadcastEscrowApprove(data){

  }
  public broadcastEscrowDisapprove(data){

  }
  public broadcastEscrowRelease(data){

  }
  public broadcastEscrowDispute(data){

  }
  private readonly baseURL = 'https://steemconnect.com/sign/';

  private getEscrowURL(op:string, data): string {
    const redirectUrl = encodeURIComponent(
      `${this.document.location.origin}/steemconnect/redirect`
    );
    return `${
      this.baseURL
    }${op}?from=${data.from}&to=${data.to}&agent=swapsteem&escrow_id=${data.id}&sbd_amount=${data.sbd_amount}%20SBD&steem_amount=${data.steem_amount}%20STEEM&fee=0.001%20SBD&ratification_deadline=${data.ratification_deadline}&escrow_expiration=${data.escrow_expiration}&json_meta=%7B%7D`;
  }
}
