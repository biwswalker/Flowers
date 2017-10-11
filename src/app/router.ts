import { SigninComponent } from './content/body/signin/signin.component';
import { CustomComponent } from './content/body/custom/custom.component';
import { CompleteOrderComponent } from './content/body/complete-order/complete-order.component';
import { ConfirmationComponent } from './content/body/confirmation/confirmation.component';
import { CheckoutComponent } from './content/body/checkout/checkout.component';
import { CartComponent } from './content/body/cart/cart.component';
import { ProductPreviewComponent } from './content/body/product-preview/product-preview.component';
import { ProductManageComponent } from './content/body/product-manage/product-manage.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { IndexComponent } from './content/body/index/index.component';
import { ProductComponent } from './content/body/product/product.component';

const appRoutes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'product', component: ProductComponent },
  { path: 'product-manage', component: ProductManageComponent },
  { path: 'preview/:pd', component: ProductPreviewComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'completeOrder', component: CompleteOrderComponent },
  { path: 'custom', component: CustomComponent},
  { path: 'signin', component: SigninComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class RouterLinkModule { }
