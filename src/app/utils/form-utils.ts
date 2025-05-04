import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  constructor(private form: FormGroup) {}
  //#region  ValidationStaticForm
  isValidField(fieldName: string): boolean | null {
    return (
      !!this.form.controls[fieldName].errors &&
      this.form.controls[fieldName].touched
    );
  }
  getFieldError(fieldName: string): string | null {
    if (!this.form.controls[fieldName].errors) return null;
    const errors = this.form.controls[fieldName].errors ?? {};
    return this.ErrorValidate(errors);
  }
  //#endregion

  //#region  ValidationDynamicForm
  isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }
  getFieldErrorInArray(formArray: FormArray, index: number) {
    if (formArray.controls.length === 0) return null;
    const errors = formArray.controls[index].errors ?? {};
    return this.ErrorValidate(errors);
  }
  //#endregion

  private ErrorValidate(errors: ValidationErrors): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `El campo debe tener al menos ${errors[key].requiredLength} caracteres`;
        case 'min':
          return `El valor mínimo es ${errors[key].min}`;
      }
    }
    return null;
  }
}
