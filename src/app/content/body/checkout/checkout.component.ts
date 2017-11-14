import { Observable } from 'rxjs/Rx';
import { LoadingService } from './../../../services/loading.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartForm } from '../../../forms/cart';
import { CartService } from '../../../services/cart.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('map') mapRef: ElementRef;

  // FormGroup
  group: FormGroup;

  // Form
  cart: CartForm;

  constructor(
    private cartService: CartService,
    private router: Router,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef) {
    console.log(this.mapRef);
  }

  displayMap() {
    const location = new google.maps.LatLng(17.385044, 78.486671);
    const option = {
      center: location,
      zoom: 10
    };
    const map = new google.maps.Map(this.mapRef.nativeElement, option);
  }

  ngAfterViewInit() {
    console.log(this.mapRef);
    this.displayMap();
  }

  ngOnInit() {

    window.scrollTo(0, 0);
    this.cart = new CartForm();
    this.cart = this.cartService.retrieve();
    if (!this.cart.order.paymentType) {
      this.cart.order.paymentType = 'T';
    }
    this.initialFormGroup();
  }

  initialFormGroup() {
    this.group = new FormGroup({
      'firstname': new FormControl(this.cart.order.firstname, Validators.required),
      'lastname': new FormControl(this.cart.order.lastname, Validators.required),
      'address': new FormControl(this.cart.address.address, Validators.required),
      'subDistrict': new FormControl(this.cart.address.subDistrict, Validators.required),
      'district': new FormControl(this.cart.address.district, Validators.required),
      'province': new FormControl(this.cart.address.province, Validators.required),
      'postcode': new FormControl(this.cart.address.postcode, [Validators.required, Validators.pattern('[0-9]+')]),
      'email': new FormControl(this.cart.address.email, [Validators.required, Validators.email]),
      'tel': new FormControl(this.cart.address.tel, Validators.required),
      'paymentType': new FormControl(this.cart.order.paymentType, Validators.required),
    });
  }

  onContinue() {
    this.loadingService.loading(true);
    this.cart.order.firstname = this.group.value.firstname;
    this.cart.order.lastname = this.group.value.lastname;
    this.cart.order.paymentType = this.group.value.paymentType;
    this.cart.address.address = this.group.value.address;
    this.cart.address.subDistrict = this.group.value.subDistrict;
    this.cart.address.district = this.group.value.district;
    this.cart.address.province = this.group.value.province;
    this.cart.address.postcode = this.group.value.postcode;
    this.cart.address.email = this.group.value.email;
    this.cart.address.tel = this.group.value.tel;
    this.cartService.updateOrder(this.cart.order, this.cart.address);
    this.router.navigateByUrl('/confirmation');
    this.loadingService.loading(false);
  }

}
