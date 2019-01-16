import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currenyPipe'
})
export class CurrenyPipePipe implements PipeTransform {

  transform(ads: any, currenyFilter?: any, adCoinFilter?: any, paymentMethodFilter?: any, adTypeFilter?: any, TabelType?: any, totalBuy?: any): any {
    console.log(totalBuy, ads, currenyFilter, adCoinFilter, paymentMethodFilter, adTypeFilter, TabelType)
    // ads = totalBuy;
    if (adTypeFilter && adTypeFilter !== TabelType) {
      return ads
    }
    var resultToShown = []
    if (totalBuy.length > 0) {
      resultToShown = totalBuy;
    } else {
      resultToShown = ads;
    }
    console.log(totalBuy);
    for (var i = 0; i < resultToShown.length; i++) {
      if (currenyFilter && resultToShown[i].currency !== currenyFilter) {
        resultToShown.splice(i, 1);
        i--;
        continue;
      }
      if (adCoinFilter && resultToShown[i].ad_coin !== adCoinFilter) {
        resultToShown.splice(i, 1);
        i--;
        continue;
      }
      if (paymentMethodFilter && resultToShown[i].payment_methods.indexOf(paymentMethodFilter) === -1) {
        resultToShown.splice(i, 1);
        i--;
        continue;
      }
    }
    return resultToShown;
  }

}
