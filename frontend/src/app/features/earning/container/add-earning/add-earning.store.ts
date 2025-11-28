import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { SalaryListStore } from '../../../../shared/state/salary-list.store';
import { WorkEntry } from '../../modals/earning.model';
import { EarningService } from '../../services/earning.service';
import { ToastService } from '../../../../core/services/toast.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ActivatedRoute, Router } from '@angular/router';

type WorkEntryState = {
  workEntry: WorkEntry | {};
  earnedAmount: number;
  kidName: string;
};

const initialWorkEntryState: WorkEntryState = {
  workEntry: {},
  earnedAmount: 0,
  kidName: '',
};

export const AddEarningStore = signalStore(
  withState(initialWorkEntryState),
  withComputed((store, salaryListStore = inject(SalaryListStore)) => ({
    salaryLevels: salaryListStore.salaryLevel,
  })),

  withMethods(
    (
      store,
      route = inject(ActivatedRoute),
      salaryListStore = inject(SalaryListStore),
      earningService = inject(EarningService),
      toastService = inject(ToastService),
      router = inject(Router),
    ) => {
      const addWorkEntry = rxMethod<WorkEntry>(
        exhaustMap((record) =>
          earningService.addWorkEntry$(record).pipe(
            tapResponse({
              next: () => {
                toastService.success('Work entry added successfully');
                router.navigate(['/kids', record.kidName, 'balance']);
              },
              error: (error: Error) => {
                toastService.error(error.message);
              },
            }),
          ),
        ),
      );

      const updateWorkEntry = rxMethod<{
        record: WorkEntry;
        entryId: number;
      }>(
        exhaustMap(({ record, entryId }) =>
          earningService.updateEntry$(entryId, record).pipe(
            tapResponse({
              next: () => {
                toastService.success('Work entry added successfully');
                router.navigate(['/kids', record.kidName, 'balance']);
              },
              error: (error: Error) => {
                toastService.error(error.message);
              },
            }),
          ),
        ),
      );

      return {
        addOrUpdateWorkEntry(formValue: any) {
          const entryId = Number(route.snapshot.paramMap.get('entryId'));

          const record: WorkEntry = {
            ...formValue,
            earnedAmount: store.earnedAmount(),
          };

          if (entryId) {
            updateWorkEntry({ record, entryId });
          } else {
            addWorkEntry(record);
          }
        },
        updatEarnedAmount({ minutes, salaryLevel }: { minutes: number; salaryLevel: string }) {
          if (!minutes || !salaryLevel) {
            return;
          }

          const level = salaryListStore.salaryLevel().find((l) => l.name === salaryLevel);

          const amount = level ? level.ratePerMinute * minutes : 0;

          patchState(store, { earnedAmount: amount });
        },
        resetearnedAmount() {
          patchState(store, { earnedAmount: 0 });
        },
        setKidName(name: string) {
          patchState(store, { kidName: name });
        },

        loadWorkEntry: rxMethod<{ kidName: string; entryId: string }>(
          pipe(
            filter(({ kidName, entryId }) => !!kidName && !!entryId),
            exhaustMap(({ kidName, entryId }) =>
              earningService.getEntryById$(kidName, +entryId).pipe(
                tapResponse({
                  next: (workEntry: WorkEntry) => patchState(store, { workEntry: workEntry }),
                  error: (error: Error) => {
                    toastService.error(error.message);
                  },
                }),
              ),
            ),
          ),
        ),
      };
    },
  ),
);
