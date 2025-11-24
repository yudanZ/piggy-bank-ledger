import {Component, input} from '@angular/core';
import {SalaryLevel} from "../../../modals/salary-level.models";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-salary-cards',
  imports: [
    DecimalPipe
  ],
  templateUrl: './salary-cards.component.html',
  styleUrl: './salary-cards.component.scss',
})
export class SalaryCardsComponent {

  public levels = input<SalaryLevel[]>([]);

}
