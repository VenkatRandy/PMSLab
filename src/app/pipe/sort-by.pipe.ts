import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
  pure: false
})
export class SortByPipe implements PipeTransform {

  transform(items: Array<any>, args?: any): any {
    return items.sort(function (a, b) {
      if (a[args.property] < b[args.property]) {
        return -1 * args.direction;
      }
      else if (a[args.property] > b[args.property]) {
        return 1 * args.direction;
      }
      else {
        return 0;
      }
    });
  }

}


