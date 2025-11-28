import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { WorkEntry } from '../../../earning/modals/earning.model';
import { SpendingEntry } from '../../../spending/modals/spending.modals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { EarningService } from '../../../earning/services/earning.service';
import { SpendingService } from '../../../spending/services/spending.service';
import { exhaustMap, forkJoin, pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ToastService } from '../../../../core/services/toast.service';

type BalanceState = {
  earningList: WorkEntry[];
  totalMinutes: number;
  totalEarned: number;
  totalSpent: number;
  balance: number;
  spendingList: SpendingEntry[];
  kidName: string;
};

const initialBalanceState: BalanceState = {
  earningList: [],
  totalMinutes: 0,
  totalEarned: 0,
  totalSpent: 0,
  balance: 0,
  spendingList: [],
  kidName: '',
};

export const BalanceStore = signalStore(
  withState(initialBalanceState),
  withMethods(
    (
      store,
      earningService = inject(EarningService),
      spendingService = inject(SpendingService),
      toastService = inject(ToastService),
    ) => ({
      loadKidsBalance: rxMethod<void>(
        pipe(
          exhaustMap(() =>
            forkJoin({
              earnings: earningService.getKidHistory$(store.kidName()),
              spendings: spendingService.getSpending$(store.kidName()),
            }),
          ),
          tapResponse({
            next: ({ earnings, spendings }) => {
              const totalMinutes = earnings.reduce((sum, t) => sum + t.minutes, 0);
              const totalEarned = earnings.reduce((sum, t) => sum + t.earnedAmount, 0);
              const totalSpent = spendings.reduce((sum, s) => sum + s.price, 0);

              const balance = totalEarned - totalSpent;
              patchState(store, {
                earningList: earnings,
                spendingList: spendings,
                totalMinutes,
                totalEarned,
                totalSpent,
                balance,
              });
            },
            error: (error: Error) => {
              toastService.error(error.message);
            },
          }),
        ),
      ),
      setKidName(name: string) {
        patchState(store, { kidName: name });
      },
    }),
  ),
);
