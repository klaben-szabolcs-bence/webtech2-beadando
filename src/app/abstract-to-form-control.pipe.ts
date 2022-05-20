import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';

@Pipe({
  name: 'abstractToFormControl'
})
export class AbstractToFormControlPipe implements PipeTransform {

  transform(value: AbstractControl, ...args: unknown[]): FormControl {
    return value as FormControl;
  }

}
