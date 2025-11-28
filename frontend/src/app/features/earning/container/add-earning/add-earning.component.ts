import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AddEarningStore } from './add-earning.store';

@Component({
  selector: 'app-add-earning',
  templateUrl: './add-earning.component.html',
  imports: [ReactiveFormsModule, DecimalPipe],
  providers: [AddEarningStore],
})
export class AddEarningComponent implements OnInit {
  private _fb = inject(FormBuilder);

  public kidName = input<string>('');
  public entryId = input<string>('');

  public addEarningStore = inject(AddEarningStore);

  public form = this._fb.group({
    kidName: this._fb.nonNullable.control('', Validators.required),
    task: this._fb.nonNullable.control('', Validators.required),
    minutes: this._fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
    salaryLevel: this._fb.nonNullable.control('', Validators.required),
    date: this._fb.nonNullable.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      const loeadedEntry = this.addEarningStore.workEntry();

      this.form.patchValue(loeadedEntry);
    });

    effect(() => {
      const kidName = this.addEarningStore.kidName();

      this.form.patchValue({ kidName: kidName });
    });
  }

  public ngOnInit() {
    if (this.kidName()) {
      this.addEarningStore.setKidName(this.kidName());
    }

    if (this.entryId()) {
      this.addEarningStore.loadWorkEntry({ kidName: this.kidName(), entryId: this.entryId() });
    }

    this.form.valueChanges.subscribe(() => {
      this.addEarningStore.updatEarnedAmount(this.form.getRawValue());
    });
  }

  public onSubmit() {
    if (!this.form.valid || !this.addEarningStore.earnedAmount()) {
      return;
    }

    this.addEarningStore.addOrUpdateWorkEntry(this.form.value);
    this.form.reset();
    this.addEarningStore.resetearnedAmount();
  }
}
