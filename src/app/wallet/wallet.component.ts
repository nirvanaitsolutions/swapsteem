import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../module/order';
import { APIService } from '../../service/api.service';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {


  userData: any = {};
  @ViewChild('openordersforyou') openOrdersForYouPaginator: MatPaginator;
  @ViewChild('openordersbyyou') closeOrdersPaginator: MatPaginator;
  @ViewChild('canceledorders') canceledOrdersPaginator: MatPaginator;
  @ViewChild('completeorders') completedOrdersPaginator: MatPaginator;

  ordersDisplayedColumns: string[] = ['createdby', 'createdfor', 'order_coin_amount', 'order_coin', 'order_rate', 'order_fiat_amount', 'currency', 'order_payment_method', 'buttons'];
  constructor(private ngxService: NgxUiLoaderService, private _auth: SteemconnectAuthService,
    private apiSer: APIService) { }
  openOrdersForYou: Observable<OrderResponse[]>;
  openOrdersByYou: Observable<OrderResponse[]>;
  emptyOpenOrder: boolean;
  emptyCloseOrders: boolean;
  openOrdersForYouDataSource: MatTableDataSource<OrderResponse> = new MatTableDataSource([]);
  openOrdersByYouDataSource: MatTableDataSource<OrderResponse> = new MatTableDataSource([]);
  completeOrdersDataSource: MatTableDataSource<OrderResponse> = new MatTableDataSource([]);
  canceledOrdersDataSource: MatTableDataSource<OrderResponse> = new MatTableDataSource([]);
  ngOnInit() {
    this.getOrders();
  }

  /**
   *
   * @name getOrders 
   *
   * @description
   * This method used to get orders created by user, for user, canceled orders and completed orders
   * @requires username current login username
  */
  getOrders() {
    this.ngxService.start();
    this.userData = this._auth.userData;
    forkJoin(this.apiSer.getOpenOrdersForUser(this.userData.name), this.apiSer.getOpenOrdersByUser(this.userData.name))
      .subscribe((data) => {
        const openOrdersForYou = data && data[0] && data[0].length ? data[0] : [];
        this.openOrdersForYouDataSource = new MatTableDataSource(openOrdersForYou.filter((order: OrderResponse) => (order.order_status !== 'canceled' && order.order_status !== 'order_complete')));
        this.openOrdersForYouDataSource.paginator = this.openOrdersForYouPaginator;
        const openOrdersByYou = data && data[1] && data[1].length ? data[1] : [];
        this.openOrdersByYouDataSource = new MatTableDataSource(openOrdersByYou.filter((order: OrderResponse) => (order.order_status !== 'canceled' && order.order_status !== 'order_complete')));
        this.openOrdersByYouDataSource.paginator = this.closeOrdersPaginator;
        let completeOrders = openOrdersForYou.filter((order: OrderResponse) => (order.order_status === 'order_complete'));
        console.log(openOrdersByYou.filter((order: OrderResponse) => (order.order_status === 'order_complete')));
        Array.prototype.push.apply(completeOrders, openOrdersByYou.filter((order: OrderResponse) => (order.order_status === 'order_complete')));
        console.log(completeOrders)
        let canceledOrders = openOrdersForYou.filter((order: OrderResponse) => (order.order_status === 'canceled'));
        Array.prototype.push.apply(canceledOrders, openOrdersByYou.filter((order: OrderResponse) => (order.order_status === 'canceled')));
        this.completeOrdersDataSource = new MatTableDataSource(completeOrders);
        this.completeOrdersDataSource.paginator = this.completedOrdersPaginator;
        this.canceledOrdersDataSource = new MatTableDataSource(canceledOrders);
        this.canceledOrdersDataSource.paginator = this.canceledOrdersPaginator;
        this.ngxService.stop();
      });
  }
}
