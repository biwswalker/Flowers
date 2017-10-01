import { AlertService } from './services/alert.service';
import { FirebaseConfigModule } from './firebase-config';
import { ProductService } from './services/product.service';
import { RouterLinkModule } from './router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { NgProgressModule } from 'ngx-progressbar';

import { AppComponent } from './app.component';
import { HeaderComponent } from './content/header/header.component';
import { FooterComponent } from './content/footer/footer.component';
import { IndexComponent } from './content/body/index/index.component';
import { ProductComponent } from './content/body/product/product.component';
import { ProductManageComponent } from './content/body/product-manage/product-manage.component';
import { AlertsComponent } from './utils/alerts/alerts.component';
import { ProductPreviewComponent } from './content/body/product-preview/product-preview.component';
import { CategoryService } from "./services/category.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    ProductComponent,
    ProductManageComponent,
    AlertsComponent,
    ProductPreviewComponent
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
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#F4B2B2',
      secondaryColour: '#F4B2B2',
      tertiaryColour: '#F4B2B2'
    }),
    NgProgressModule
  ],
  providers: [
    ProductService,
    AlertService,
    CategoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
