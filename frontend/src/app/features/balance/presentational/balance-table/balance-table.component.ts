import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SpendingEntry } from '../../../spending/modals/spending.modals';
import { WorkEntry } from '../../../earning/modals/earning.model';

@Component({
  selector: 'app-balance-table',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './balance-table.component.html',
})
export class BalanceTableComponent {
  public kidName = input('');
  public earningList = input<WorkEntry[]>([]);
  public spendingList = input<SpendingEntry[]>([]);

  public totalMinutes = input(0);
  public totalEarned = input(0);
  public totalSpent = input(0);
  public balance = input(0);

  public editEarning = output<WorkEntry>();
  public deleteEarning = output<WorkEntry>();

  public editSpending = output<SpendingEntry>();
  public deleteSpending = output<SpendingEntry>();
}
