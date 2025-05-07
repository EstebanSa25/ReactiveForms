import { Component, effect, inject, signal } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  countryService = inject(CountryService);
  fb = inject(FormBuilder);
  regions = signal(this.countryService.regions);
  countriesByRegions = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChange = effect((onCleanup) => {
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();
    onCleanup(() => {
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
      console.log('Unsubscribed from region');
    });
  });

  onRegionChanged() {
    return this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => {
          this.myForm.get('country')?.setValue('');
        }),
        tap(() => {
          this.myForm.get('border')?.setValue('');
        }),
        tap(() => {
          this.borders.set([]);
          this.countriesByRegions.set([]);
        }),
        switchMap((region) => this.countryService.getCountriesByRegion(region!))
      )
      .subscribe((countries) => {
        console.log(countries);
        this.countriesByRegions.set(countries);
      });
  }

  onCountryChanged() {
    return this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value) => value!.length > 0),
        switchMap((alphaCode) =>
          this.countryService.getCountryByAlphaCode(alphaCode ?? '')
        ),
        switchMap((country) =>
          this.countryService.getCountryNamesByCodeArray(country.borders)
        )
      )
      .subscribe((borders) => {
        this.borders.set(borders);
      });
  }
}
