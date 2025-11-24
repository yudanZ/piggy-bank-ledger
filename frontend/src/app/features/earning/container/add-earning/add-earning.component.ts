import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalaryService } from '../../../salary-config/services/salary.service';
import { DecimalPipe } from '@angular/common';
import { SalaryLevel } from '../../../salary-config/modals/salary-level.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EarningService } from '../../services/earning.service';
import { WorkEntry } from '../../modals/earning.model';
import { ToastService } from '../../../../core/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-earning',
  templateUrl: './add-earning.component.html',
  imports: [ReactiveFormsModule, DecimalPipe],
})
export class AddEarningComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _salaryService = inject(SalaryService);
  private _workEntryService = inject(EarningService);
  private _toastService = inject(ToastService);
  private _destroy = inject(DestroyRef);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  public form!: FormGroup;
  public earnedAmount = 0;
  public levels: SalaryLevel[] = [];

  private _isUpdated = false;
  private _entryId!: number;

  public ngOnInit() {
    this.form = this._fb.group({
      kidName: ['', Validators.required],
      task: ['', Validators.required],
      minutes: [0, [Validators.required, Validators.min(1)]],
      salaryLevel: ['', Validators.required],
      date: ['', Validators.required],
    });

    const kidNameFromRoute = this._route.snapshot.paramMap.get('kidName');

    this._entryId = Number(this._route.snapshot.paramMap.get('entryId'));

    if (kidNameFromRoute) {
      this.form.patchValue({ kidName: kidNameFromRoute });
    }

    if (this._entryId) {
      this._isUpdated = true;
      this.loadEntryForEdit(kidNameFromRoute!, this._entryId);
    }

    this._salaryService
      .getLevels$()
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe((levels) => (this.levels = levels));

    this.form.valueChanges.subscribe(() => {
      this.earnedAmount = this.calculateEarning(this.levels);
    });
  }

  public onSubmit() {
    if (!this.form.valid || !this.earnedAmount) return;

    const record: WorkEntry = {
      ...this.form.value,
      earnedAmount: this.earnedAmount,
    };

    const operation$ = this._isUpdated
      ? this._workEntryService.updateEntry$(this._entryId, record)
      : this._workEntryService.addWorkEntry$(record);

    this._handleSaveOperation(operation$, record.kidName);
  }

  private _handleSaveOperation(operation$: Observable<void>, kidName: string) {
    operation$.pipe(takeUntilDestroyed(this._destroy)).subscribe({
      next: () => {
        this._toastService.success('✅ Work entry saved successfully!');
        this._router.navigate(['/kids', kidName, 'balance']);
        this.form.reset();
        this.earnedAmount = 0;
      },
      error: () => {
        this._toastService.error(`❌ Failed to ${this._isUpdated ? 'update' : 'save'} entry`);
      },
    });
  }

  private calculateEarning(levels: SalaryLevel[]): number {
    const { minutes, salaryLevel } = this.form.value;
    const level = levels.find((l) => l.name === salaryLevel);

    return level ? level.ratePerMinute * minutes : 0;
  }

  private loadEntryForEdit(kidName: string, entryId: number) {
    this._workEntryService
      .getEntryById$(kidName, entryId)
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe((entry) => {
        this.form.patchValue(entry);
      });
  }
}
