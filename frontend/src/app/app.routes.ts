import { Routes } from '@angular/router';
import { SalaryListComponent } from './features/salary-config/container/salary-list/salary-list/salary-list.component';
import { AddEarningComponent } from './features/earning/container/add-earning/add-earning.component';
import { BalanceComponent } from './features/balance/container/balance/balance.component';
import { WishListComponent } from './features/wish-list/container/wish-list/wish-list.component';
import { AddWishComponent } from './features/wish-list/container/add-wish/add-wish.component';
import { HomeComponent } from './core/component/home/home.component';
import { AddSpendingComponent } from './features/spending/container/add-spending/add-spending.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'salary-list', component: SalaryListComponent },
  { path: 'add-earning', component: AddEarningComponent },
  { path: 'add-spending', component: AddSpendingComponent },
  { path: 'kids/:kidName/add-earning', component: AddEarningComponent },
  {
    path: 'kids/:kidName/edit-earning/:entryId',
    component: AddEarningComponent,
  },
  {
    path: 'kids/:kidName/edit-spending/:entryId',
    component: AddSpendingComponent,
  },
  {
    path: 'kids/balance',
    component: BalanceComponent,
  },
  {
    path: 'kids/:kidName/balance',
    component: BalanceComponent,
  },
  { path: 'wish-list', component: WishListComponent },
  { path: 'kids/:kidName/wish-list', component: WishListComponent },
  { path: 'kids/:kidName/add-wish', component: AddWishComponent },
  { path: 'kids/:kidName/edit-wish/:wishId', component: AddWishComponent },
  { path: '**', redirectTo: '' },
];
