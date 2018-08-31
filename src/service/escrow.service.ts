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
    this.document.location.href = this.getEscrowTrasnferURL(data);
  }
  public broadcastEscrowApprove(data){
    this.document.location.href = this.getEscrowApproveURL(data);
  }
  public broadcastEscrowDisapprove(data){
    this.document.location.href = this.getEscrowApproveURL(data);
  }
  public broadcastEscrowRelease(data){
    this.document.location.href = this.getEscrowReleaseURL(data);
  }
  public broadcastEscrowDispute(data){
    this.document.location.href = this.getEscrowDisputeURL(data);
  }
  private readonly baseURL = 'https://steemconnect.com/sign/';

  private getEscrowTrasnferURL( data): string {
    const redirectUrl = encodeURIComponent(
      `${this.document.location.origin}/steemconnect/redirect`
    );
    return `${
      this.baseURL
    }escrow_transfer?from=${data.from}&to=${data.to}&agent=swapsteem&escrow_id=${data.id}&sbd_amount=${data.sbd_amount}%20SBD&steem_amount=${data.steem_amount}%20STEEM&fee=0.001%20SBD&ratification_deadline=${data.ratification_deadline}&escrow_expiration=${data.escrow_expiration}&json_meta=%7B%7D`;
  }

  private getEscrowApproveURL( data): string {
    const redirectUrl = encodeURIComponent(
      `${this.document.location.origin}/steemconnect/redirect`
    );
    return `${
      this.baseURL
    }escrow_approve?from=${data.from}&to=${data.to}&agent=swapsteem&escrow_id=${data.id}&who=${data.who}approve=${data.approve}`;
  }
  private getEscrowReleaseURL( data): string {
    const redirectUrl = encodeURIComponent(
      `${this.document.location.origin}/steemconnect/redirect`
    );
    return `${
      this.baseURL
    }escrow-release?from=${data.from}&to=${data.to}&agent=swapsteem&escrow_id=${data.id}&who=${data.who}&receiever=${data.receiver}&sbd_amount=${data.sbd_amount}%20SBD&steem_amount=${data.steem_amount}%20STEEM`;
  }
  private getEscrowDisputeURL( data): string {
    const redirectUrl = encodeURIComponent(
      `${this.document.location.origin}/steemconnect/redirect`
    );
    return `${
      this.baseURL
    }escrow-dispute?from=${data.from}&to=${data.to}&agent=swapsteem&escrow_id=${data.id}&who=${data.who}`;
  }
}
