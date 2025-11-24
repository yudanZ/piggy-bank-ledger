import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EarningService } from '../../../earning/services/earning.service';
import { WorkEntry } from '../../../earning/modals/earning.model';
import { forkJoin, map } from 'rxjs';
import { BalanceTableComponent } from '../../presentational/balance-table/balance-table.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpendingService } from '../../../spending/services/spending.service';
import { SpendingEntry } from '../../../spending/modals/spending.modals';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  imports: [ReactiveFormsModule, BalanceTableComponent],
})
export class BalanceComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _earningService = inject(EarningService);
  private _spendingService = inject(SpendingService);
  private _fb = inject(FormBuilder);
  private _destroyRef = inject(DestroyRef);

  public kidName = signal('');
  public earningList = signal<WorkEntry[]>([]);
  public spendingList = signal<SpendingEntry[]>([]);
  public totalMinutes = signal(0);
  public totalEarned = signal(0);
  public totalSpent = signal(0);
  public balance = signal(0);

  public searchForm = this._fb.group({
    kidNameInput: ['', Validators.required],
  });

  public ngOnInit() {
    const routeKidName = this._route.snapshot.paramMap.get('kidName');

    if (routeKidName) {
      this.kidName.set(routeKidName);

      this.loadKidHistory(routeKidName);
    }
  }

  public submitSearch() {
    if (this.searchForm.valid) {
      const name = this.searchForm.value.kidNameInput!;

      this.kidName.set(name);
      this.loadKidHistory(name);
    }
  }

  public addWorkEntry() {
    this._router.navigate(['/kids', this.kidName(), 'add-entry']);
  }

  public onEditEarning(entry: WorkEntry) {
    this._router.navigate(['/kids', entry.kidName, 'edit-earning', entry.id]);
  }

  public onDeleteEarning(entry: WorkEntry) {
    this._earningService
      .deleteEntry$(entry.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this.loadKidHistory(this.kidName()));
  }

  public onEditSpending(entry: SpendingEntry) {
    this._router.navigate(['/kids', entry.kidName, 'edit-spending', entry.id]);
  }

  public onDeleteSpending(entry: SpendingEntry) {
    this._spendingService
      .deleteSpending$(entry.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this.loadKidHistory(this.kidName()));
  }

  private loadKidHistory(name: string) {
    forkJoin({
      earning: this._earningService.getKidHistory$(name),
      spending: this._spendingService.getSpending$(name),
    })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(({ earning, spending }) => {
        if (earning) {
          this.earningList.set(earning);
          this.totalMinutes.set(earning.reduce((sum, t) => sum + t.minutes, 0));
          this.totalEarned.set(earning.reduce((sum, t) => sum + t.earnedAmount, 0));
        }

        if (spending) {
          this.spendingList.set(spending);
          this.totalSpent.set(spending.reduce((sum, s) => sum + s.price, 0));
        }

        this.updateBalance();
      });
  }

  private updateBalance() {
    this.balance.set(this.totalEarned() - this.totalSpent());
  }
}
