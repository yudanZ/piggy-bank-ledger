import { Component, inject, DestroyRef, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { WishListTableComponent } from '../../presentational/wish-list-table/wish-list-table.component';
import { WishListService } from '../../services/wish-list.service';
import { Wish } from '../../modals/wish-list.models';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, WishListTableComponent],
})
export class WishListComponent implements OnInit {
  private _wishListService = inject(WishListService);
  private _fb = inject(FormBuilder);
  private _destroy = inject(DestroyRef);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  public kidName = signal('');
  public wishes = signal<Wish[]>([]);
  public totalEarned = signal(0);

  public searchForm = this._fb.group({
    kidNameInput: ['', Validators.required],
  });

  public ngOnInit() {
    const routeKidName = this._route.snapshot.paramMap.get('kidName');

    if (routeKidName) {
      this.loadWishes(routeKidName);
    }
  }

  public submitSearch() {
    if (this.searchForm.valid) {
      const name = this.searchForm.value.kidNameInput!;

      this.loadWishes(name);
    }
  }

  public addWish() {
    this._router.navigate(['/kids', this.kidName(), 'add-wish']);
  }

  public editWish(wish: Wish) {
    this._router.navigate(['/kids', this.kidName(), 'edit-wish', wish.id]);
  }

  public removeWish(wish: Wish) {
    if (!confirm(`Delete wish "${wish.wish}"?`)) return;

    this._wishListService
      .deleteWish$(wish.id)
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(() => this.loadWishes(this.kidName()));
  }

  private loadWishes(name: string) {
    this.kidName.set(name);

    this._wishListService
      .getWishesByKidName$(name)
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe((w) => this.wishes.set(w));
  }
}
