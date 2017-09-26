import { ProductManageComponent } from './content/body/product-manage/product-manage.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { IndexComponent } from './content/body/index/index.component';
import { ProductComponent } from './content/body/product/product.component';

const appRoutes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'product', component: ProductComponent },
  { path: 'product-manage', component: ProductManageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class RouterLinkModule { }
