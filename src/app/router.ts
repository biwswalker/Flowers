import { OrderManageComponent } from './content/body/order-manage/order-manage.component';
import { AdminComponent } from "./content/body/admin/admin.component";
import { TrackingComponent } from "./content/body/tracking/tracking.component";
import { PaymentComponent } from "./content/body/payment/payment.component";
import { CompleteOrderComponent } from "./content/body/complete-order/complete-order.component";
import { ConfirmationComponent } from "./content/body/confirmation/confirmation.component";
import { CheckoutComponent } from "./content/body/checkout/checkout.component";
import { CartComponent } from "./content/body/cart/cart.component";
import { ProductPreviewComponent } from "./content/body/product-preview/product-preview.component";
import { ProductManageComponent } from "./content/body/product-manage/product-manage.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { IndexComponent } from "./content/body/index/index.component";
import { ProductComponent } from "./content/body/product/product.component";

const appRoutes: Routes = [
  { path: "", component: IndexComponent },
  { path: "product", component: ProductComponent },
  { path: "preview/:pd", component: ProductPreviewComponent },
  { path: "cart", component: CartComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "confirmation", component: ConfirmationComponent },
  { path: "completeOrder", component: CompleteOrderComponent },
  { path: "signin", component: AdminComponent },
  { path: "payment", component: PaymentComponent },
  { path: "tracking", component: TrackingComponent },
  { path: "signin", component: AdminComponent },
  { path: "order-manage", component: OrderManageComponent },
  {
    path: "admin",
    component: AdminComponent,
    children: [{ path: "product-manage", component: ProductManageComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class RouterLinkModule {}
