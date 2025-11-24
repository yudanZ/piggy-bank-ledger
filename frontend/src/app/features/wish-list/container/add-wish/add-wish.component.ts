import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WishListService } from '../../services/wish-list.service';
import { Wish } from '../../modals/wish-list.models';

@Component({
  selector: 'app-add-wish',
  templateUrl: './add-wish.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddWishComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _wishListService = inject(WishListService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _destroy = inject(DestroyRef);

  public form!: FormGroup;
  public kidName = '';
  public isEditing = false;
  private _wishId?: number;

  public ngOnInit() {
    this.kidName = this._route.snapshot.paramMap.get('kidName') || '';
    this._wishId = Number(this._route.snapshot.paramMap.get('wishId'));
    this.isEditing = !!this._wishId;

    this.form = this._fb.group({
      kidName: [this.kidName, Validators.required],
      wish: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      bought: [false],
      whereToBuy: [''],
      expectedDate: ['', Validators.required],
    });

    if (this.isEditing && this._wishId) {
      this._wishListService
        .getWishById$(this._wishId)
        .pipe(takeUntilDestroyed(this._destroy))
        .subscribe((wish) => {
          this.form.patchValue(wish);
        });
    }
  }

  public submit() {
    if (this.form.invalid) return;

    const payload: Wish = { ...this.form.value, id: this._wishId ?? Date.now() };

    const request$ =
      this.isEditing && this._wishId
        ? this._wishListService.updateWish$(this._wishId, payload)
        : this._wishListService.addWish$(payload);

    request$.pipe(takeUntilDestroyed(this._destroy)).subscribe({
      next: () => {
        this._router.navigate(['/kids', this.kidName, 'wish-list']);
      },
      error: (err) => console.error('Failed to save wish', err),
    });
  }
}
