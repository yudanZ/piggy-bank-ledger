import { Component, Input, Output, EventEmitter, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wish } from '../../modals/wish-list.models';

@Component({
  selector: 'app-wish-list-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wish-list-table.component.html',
})
export class WishListTableComponent {
  public kidName = input('');
  public wishes = input<Wish[]>([]);
  public totalEarned = input(0);

  public addWish = output();
  public editWish = output<Wish>();
  public removeWish = output<Wish>();
}
