import { Pipe, PipeTransform } from '@angular/core';
import { Collection } from './collection';

@Pipe({
  name: 'publicUrl'
})
export class PublicUrlPipe implements PipeTransform {

  transform(value: Collection, ...args: unknown[]): string {
    if (value.publicView) {
      return '<a href="/public/viewCollection?collectionId=' + value.id + '">Public URL</a>';
    } else {
      return '';
    }
  }

}
