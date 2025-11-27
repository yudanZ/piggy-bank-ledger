import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SalaryService } from '../../../services/salary.service';
import { SalaryLevel } from '../../../modals/salary-level.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SalaryCardsComponent } from '../../../presentational/salary-cards/salary-cards/salary-cards.component';
import { salaryListStore } from './salary-list.store';

@Component({
  selector: 'app-salary-list',
  imports: [SalaryCardsComponent],
  templateUrl: './salary-list.component.html',
  styleUrl: './salary-list.component.scss',
  providers: [salaryListStore],
})
export class SalaryListComponent {
  public salaryListStore = inject(salaryListStore);
}
