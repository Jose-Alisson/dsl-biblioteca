import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(any: any[], column: string, row?: string | null): any[] {
    const uniqueValues = new Set<any>();

    if(row != '' && row != null && row != undefined){
      any.filter(item => item[column] === row).forEach(item => uniqueValues.add(item));
    } else {
      any.map(item => item[column]).forEach(item => uniqueValues.add(item))
    }

    return Array.from(uniqueValues)
  }
}
