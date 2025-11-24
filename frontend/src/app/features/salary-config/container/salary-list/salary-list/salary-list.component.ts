import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SalaryService } from '../../../services/salary.service';
import { SalaryLevel } from '../../../modals/salary-level.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SalaryCardsComponent } from '../../../presentational/salary-cards/salary-cards/salary-cards.component';

@Component({
  selector: 'app-salary-list',
  imports: [SalaryCardsComponent],
  templateUrl: './salary-list.component.html',
  styleUrl: './salary-list.component.scss',
})
export class SalaryListComponent implements OnInit {
  private _salaryService = inject(SalaryService);
  private _destroy = inject(DestroyRef);

  public salarylist = signal<SalaryLevel[]>([]);

  public ngOnInit() {
    this._salaryService
      .getLevels$()
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe((list) => {
        this.salarylist.set(list);
      });
  }
}
