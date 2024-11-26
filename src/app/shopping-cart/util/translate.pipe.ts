import { Pipe, PipeTransform } from '@angular/core';
import { ShoppingCartService } from '../service/shopping-cart.service';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  constructor(private shoppingCartService: ShoppingCartService) {}

  transform(value: string): string {
    return this.shoppingCartService.translate(value);
  }
}
