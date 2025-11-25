import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  input,
  output,
  linkedSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wish } from '../../modals/wish-list.models';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-wish-list-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CommonModule,
    TagModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    Ripple,
  ],
  templateUrl: './wish-list-table.component.html',
})
export class WishListTableComponent {
  public kidName = input('');
  public wishes = input<Wish[]>([]);
  public totalEarned = input(0);

  public updatedlWishes = linkedSignal(() => [...this.wishes()]);

  private _editingWhish = signal<Wish | null>(null);

  public purchasedStatuses = [
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ];

  public addWish = output();
  public editWish = output<Wish>();
  public removeWish = output<Wish>();

  public onRowEditInit(wish: Wish) {
    this._editingWhish.set(wish);
  }

  public onRowEditCancel(wish: Wish) {
    const updatedWish = this._editingWhish();
    if (!updatedWish) return;

    this.updatedlWishes.update((list) => list.map((w) => (w.id === wish.id ? updatedWish : w)));

    this._editingWhish.set(null);
  }
}
