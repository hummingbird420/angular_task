import { formatCurrency, formatNumber, TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform, Type } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ShoppingCartState } from '../cart-states';
import { CartOptions, ClassInfo, ThankYouPageClassInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';

@Pipe({
  name: 'formatClassInfo',
  pure: true,
})
export class FormatClassInfoPipe implements PipeTransform {
  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;
  private _locale = 'en-US';
  private _decimalFormat = '1.2-2';
  private _currency = '$';
  constructor(private titleCase: TitleCasePipe, private cartService: ShoppingCartService) {
    this.cartOptions$.pipe(take(1)).subscribe((options) => {
      if (options.currencySign) this._currency = options.currencySign;
    });
  }
  transform(classInfo: ClassInfo | ThankYouPageClassInfo, propertyName: string): string | number {
    switch (propertyName) {
      case 'session':
        return classInfo.session;
      case 'dates':
        return classInfo.dates;
      case 'clinicalHour':
        return this.toDecimal(classInfo.clinicalHours || (classInfo as ThankYouPageClassInfo).clinicalHour);
      case 'labHour':
        return this.toDecimal(classInfo.labHours || (classInfo as ThankYouPageClassInfo).labHour);
      case 'coordinator':
        return this.titleCase.transform(classInfo.coordinator);
      case 'courseName':
        return classInfo.courseName || '';
      case 'course':
        const courseNumber = (classInfo.courseNumber || '' + ' ').trim();
        return courseNumber + (classInfo.courseName || (classInfo as ThankYouPageClassInfo).course || '');
      case 'fees':
        return this.toCurrency(classInfo.fees);
      case 'instructionalHours':
        return this.toDecimal(classInfo.instructionalHours);
      case 'instructor':
        if (Array.isArray(classInfo.instructor)) {
          return classInfo.instructor.reduce((prev, curr) => {
            return prev ? prev + '<br>' + curr : curr;
          }, '');
        }
        return '';
      case 'labHours':
        return this.toDecimal(classInfo.labHours || (classInfo as ThankYouPageClassInfo).labHour);
      case 'clinicalHours':
        return this.toDecimal(classInfo.clinicalHours || (classInfo as ThankYouPageClassInfo).clinicalHour);
      case 'lessonDuration':
        return this.toDecimal(classInfo.lessonDuration);
      case 'location':
        return classInfo.location;
      case 'minimumAge':
        return classInfo.minimumAge;
      case 'price':
        return this.toCurrency(classInfo.price);
      case 'registrationEnds':
        return classInfo.statusMessage;
      case 'seatsAvailable':
        return classInfo.seatsAvailable;
      case 'session':
        return classInfo.session;
      case 'time':
        return classInfo.time;
      case 'tuition':
        return this.toCurrency(classInfo.tuition);
      case 'comments':
        return classInfo.comments || '';
      case 'name':
        return classInfo.studentName || classInfo.name || '';
      case 'studentName':
        return classInfo.studentName || classInfo.name || '';
      case 'quantity':
        return (classInfo as ThankYouPageClassInfo).quantity || '';
      case 'unitPrice':
        return (classInfo as ThankYouPageClassInfo).unitPrice || '';
      case 'total':
        return (classInfo as ThankYouPageClassInfo).total || '';
      default:
        return '';
    }
  }

  toCurrency(value: number) {
    return formatCurrency(value, this._locale, this._currency, undefined, this._decimalFormat);
  }

  toDecimal(value: number) {
    if(!value) return '0.00';
    const formatedValue = formatNumber(value, this._locale, this._decimalFormat);    
    return formatedValue ? formatedValue : '0.00';
  }
}
