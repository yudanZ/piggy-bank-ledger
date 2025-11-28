import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ToastService } from '../../core/services/toast.service';
import { SalaryLevel } from '../models/salary-level.models';
import { SalaryService } from '../salary.service';

type SalaryListState = {
  salaryLevel: SalaryLevel[];
};

const initialState: SalaryListState = {
  salaryLevel: [],
};

export const SalaryListStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods(
    (store, salaryService = inject(SalaryService), toastService = inject(ToastService)) => ({
      loadSalaryList: rxMethod<void>(
        exhaustMap(() =>
          salaryService.getLevels$().pipe(
            tapResponse({
              next: (salaryList: SalaryLevel[]) => patchState(store, { salaryLevel: salaryList }),
              error: (error: Error) => {
                toastService.error(error.message);
              },
            }),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit: (store) => store.loadSalaryList(),
  }),
);
