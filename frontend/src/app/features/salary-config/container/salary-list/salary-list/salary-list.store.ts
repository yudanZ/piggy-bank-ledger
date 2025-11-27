import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { SalaryLevel } from '../../../modals/salary-level.models';
import { SalaryService } from '../../../services/salary.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ToastService } from '../../../../../core/services/toast.service';

type SalaryListState = {
  salaryLevel: SalaryLevel[];
};

const initialState: SalaryListState = {
  salaryLevel: [],
};

export const salaryListStore = signalStore(
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
    onInit(store) {
      store.loadSalaryList();
    },
  }),
);
