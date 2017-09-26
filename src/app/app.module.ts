import { FirebaseConfigModule } from './firebase-config';
import { ProductService } from './services/product.service';
import { RouterLinkModule } from './router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { HeaderComponent } from './content/header/header.component';
import { FooterComponent } from './content/footer/footer.component';
import { IndexComponent } from './content/body/index/index.component';
import { ProductComponent } from './content/body/product/product.component';
import { ProductManageComponent } from './content/body/product-manage/product-manage.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    ProductComponent,
    ProductManageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterLinkModule,
    DataTablesModule,
    ReactiveFormsModule,
    FirebaseConfigModule
  ],
  providers: [
    ProductService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
