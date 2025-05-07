import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
//#region Patterns
export const namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
export const emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
export const notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
//#endregion

//#region  Custom Validators
export const isFieldOneEqualToFieldTwo =
  (fieldOne: string, fieldTwo: string) => (formGroup: AbstractControl) => {
    const fieldValue = formGroup.get(fieldOne)?.value;
    const fieldValue2 = formGroup.get(fieldTwo)?.value;
    return fieldValue === fieldValue2 ? null : { notEqual: true };
  };
export const notStrider = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  return value === 'strider' ? { noStrider: true } : null;
};
async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}
export const checkingServerResponse = async (
  control: AbstractControl
): Promise<ValidationErrors | null> => {
  await sleep();
  const formValue = control.value;
  if (formValue === 'hola@mundo.com') return { emailTaken: true };
  return null;
};
//#endregion

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
        case 'email':
          return 'El valor ingresado no es un correo electrónico válido';
        case 'emailTaken':
          return 'El correo electrónico ya está en uso';
        case 'pattern':
          if (errors['pattern'].requiredPattern === emailPattern) {
            return 'El valor ingresado no es un correo electrónico válido';
          }
          return 'Error de patron contra expresion regular';
        case 'noStrider':
          return 'El valor no puede ser strider';
        default:
          return `Error de validacion no controlado ${key}`;
      }
    }
    return null;
  }
}
