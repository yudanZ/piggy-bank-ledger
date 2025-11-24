import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpendingService } from '../../services/spending.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { SpendingEntry } from '../../modals/spending.modals';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-add-spending',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-spending.component.html',
})
export class AddSpendingComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _spendingService = inject(SpendingService);
  private _toastService = inject(ToastService);
  private _destroy = inject(DestroyRef);

  public kidName = '';
  public form!: FormGroup;
  public isEditing = false;

  public ngOnInit() {
    const kidNameFromRoute = this._route.snapshot.paramMap.get('kidName') ?? '';
    const entryId = Number(this._route.snapshot.paramMap.get('entryId'));

    this.isEditing = !!entryId;

    this.form = this._fb.group({
      kidName: ['', Validators.required],
      item: ['', Validators.required],
      store: [''],
      price: [0, [Validators.required, Validators.min(0.1)]],
      date: ['', Validators.required],
    });

    if (kidNameFromRoute) {
      this.form.patchValue({ kidName: kidNameFromRoute });
    }

    if (this.isEditing && entryId) {
      this._spendingService
        .getSpendingById$(kidNameFromRoute, entryId)
        .pipe(takeUntilDestroyed(this._destroy))
        .subscribe((wish) => {
          this.form.patchValue(wish);
        });
    }
  }

  public submit() {
    if (this.form.invalid) {
      return;
    }

    const entry: SpendingEntry = {
      ...this.form.value,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    this._spendingService
      .addSpending$(entry)
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe({
        next: () => {
          this._toastService.success('✅ spending saved successfully!');
          this.form.reset();
        },
        error: () => {
          this._toastService.error(`❌ Failed to save entry`);
        },
      });
  }
}
