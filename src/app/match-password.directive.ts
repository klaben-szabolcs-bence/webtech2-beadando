import { Directive, Input } from '@angular/core';
import { AbstractControl, FormControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appMatchPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MatchPasswordDirective, multi: true }]
})
export class MatchPasswordDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    return matchPassword(control);
  }


}

export const matchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  console.log(password?.value + ' ' + confirmPassword?.value);
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    password.setErrors({ matchPassword: true });
    confirmPassword.setErrors({ matchPassword: true });
    return { matchPassword: true };
  }
  password?.setErrors(null);
  confirmPassword?.setErrors(null);
  return null;
}