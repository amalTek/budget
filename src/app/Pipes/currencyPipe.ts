import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat' })
export class CurrencyPipe implements PipeTransform {
  transform(
    value: number,
    currencyCode: string = 'TND',
    decimalPlaces: number = 3
  ): string {
    if (value == null || isNaN(value)) return '';
    return `${value.toFixed(decimalPlaces)} ${currencyCode}`;
  }
}