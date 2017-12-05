import { EmailService } from './services/email.service';
import { LoadingService } from './services/loading.service';
import { LoginComponent } from './content/body/login/login.component';
import { OrderService } from './services/order.service';
import { PaymentService } from './services/payment.service';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';
import { LocalStorageService, StorageService } from './services/local-storage.service';
import { CartService } from './services/cart.service';
import { AlertService } from './services/alert.service';
import { FirebaseConfigModule } from './firebase-config';
import { ProductService } from './services/product.service';
import { RouterLinkModule } from './router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './content/header/header.component';
import { FooterComponent } from './content/footer/footer.component';
import { IndexComponent } from './content/body/index/index.component';
import { ProductComponent } from './content/body/product/product.component';
import { ProductManageComponent } from './content/body/product-manage/product-manage.component';
import { AlertsComponent } from './utils/alerts/alerts.component';
import { ProductPreviewComponent } from './content/body/product-preview/product-preview.component';
import { CategoryService } from "./services/category.service";
import { CartComponent } from './content/body/cart/cart.component';
import { CheckoutComponent } from './content/body/checkout/checkout.component';
import { ConfirmationComponent } from './content/body/confirmation/confirmation.component';
import { CompleteOrderComponent } from './content/body/complete-order/complete-order.component';
import { SigninComponent } from './content/body/signin/signin.component';
import { PaymentComponent } from './content/body/payment/payment.component';
import { TrackingComponent } from './content/body/tracking/tracking.component';
import { OrderManageComponent } from './content/body/order-manage/order-manage.component';
import { PaymentInfoComponent } from './content/body/payment-info/payment-info.component';
import { OrderInfoComponent } from './content/body/order-info/order-info.component';
import { StoreComponent } from './content/body/store/store.component';
import { EditStoreComponent } from './content/body/store/edit-store/edit-store.component';
import { StoreService } from './services/store.service';
import { ListStoreComponent } from './content/body/store/list-store/list-store.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    ProductComponent,
    ProductManageComponent,
    AlertsComponent,
    ProductPreviewComponent,
    CartComponent,
    CheckoutComponent,
    ConfirmationComponent,
    CompleteOrderComponent,
    SigninComponent,
    PaymentComponent,
    TrackingComponent,
    LoginComponent,
    OrderManageComponent,
    PaymentInfoComponent,
    OrderInfoComponent,
    StoreComponent,
    EditStoreComponent,
    ListStoreComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterLinkModule,
    DataTablesModule,
    ReactiveFormsModule,
    FirebaseConfigModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.wanderingCubes,
      fullScreenBackdrop: true,
      backdropBackgroundColour: 'rgba(0,0,0,0.4)',
      backdropBorderRadius: '4px',
      primaryColour: '#F4B2B2',
      secondaryColour: '#F4B2B2',
      tertiaryColour: '#F4B2B2'
    }),
  ],
  providers: [
    ProductService,
    AlertService,
    CategoryService,
    CartService,
    LocalStorageService,
    UtilsService,
    AuthService,
    PaymentService,
    OrderService,
    LoadingService,
    EmailService,
    StoreService,
    { provide: StorageService, useClass: LocalStorageService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
