import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tradePipe'
})
export class TradePipePipe implements PipeTransform {
  transform(ads: any, filedName?: any, filedValue?: any): any {
    if (ads instanceof Array)
      return ads.filter(ad => ad[filedName] !== filedValue);
    else 
      return [];
  }
}
