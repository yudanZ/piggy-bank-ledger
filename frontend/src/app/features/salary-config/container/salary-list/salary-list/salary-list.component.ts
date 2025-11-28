import { Component, inject } from '@angular/core';
import { SalaryCardsComponent } from '../../../presentational/salary-cards/salary-cards/salary-cards.component';
import { SalaryListStore } from '../../../../../shared/state/salary-list.store';

@Component({
  selector: 'app-salary-list',
  imports: [SalaryCardsComponent],
  templateUrl: './salary-list.component.html',
  styleUrl: './salary-list.component.scss',
})
export class SalaryListComponent {
  public salaryListStore = inject(SalaryListStore);
}
