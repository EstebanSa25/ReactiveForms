import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.component.html',
})
export class DynamicPageComponent {
  private fb = inject(FormBuilder);
  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array([], Validators.minLength(3)),
  });
  formUtils = new FormUtils(this.myForm);

  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray;
  }
  newFavorite = new FormControl('', Validators.required);
  onAddToFavorites() {
    if (this.newFavorite.invalid) return;
    const newGame = this.newFavorite.value;
    this.favoriteGames.push(this.fb.control(newGame, Validators.required));
    this.newFavorite.reset();
  }
  onDeleteFavorite(index: number) {
    this.favoriteGames.removeAt(index);
  }
  onSubmit() {
    this.myForm.markAllAsTouched();
  }
}
