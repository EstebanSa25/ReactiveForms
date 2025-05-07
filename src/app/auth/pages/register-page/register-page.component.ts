import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  checkingServerResponse,
  emailPattern,
  FormUtils,
  isFieldOneEqualToFieldTwo,
  namePattern,
  notOnlySpacesPattern,
  notStrider,
} from '../../../utils/form-utils';
@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);

  myForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.pattern(namePattern)]],
      email: [
        '',
        [Validators.required, Validators.pattern(emailPattern)],
        [checkingServerResponse],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(notOnlySpacesPattern),
          notStrider,
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required],
    },
    {
      validators: [isFieldOneEqualToFieldTwo('password', 'password2')],
    }
  );

  formUtils = new FormUtils(this.myForm);

  onSubmit() {
    this.myForm.markAllAsTouched();
    if (
      this.myForm.controls['password'].value !==
      this.myForm.controls['password2'].value
    ) {
      alert('Passwords do not match');
      return;
    }
  }
}
