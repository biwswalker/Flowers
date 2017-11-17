import { Store } from '../../../models/store';
import { LoadingService } from './../../../services/loading.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartForm } from '../../../forms/cart';
import { CartService } from '../../../services/cart.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { mapStyle, subDistrictData } from '../../../dataset';
import { Observable } from 'rxjs/Observable';

declare var google: any;
declare var document: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('destination') destinationRef: ElementRef;
  @ViewChild('distance') distanceRef: ElementRef;
  @ViewChild('dilivery') diliveryRef: ElementRef;
  @ViewChild('diliveryCost') diliveryCostRef: ElementRef;
  @ViewChild('finalTotal') finalTotelRef: ElementRef;

  // Google
  private map;
  private geocoder = new google.maps.Geocoder;
  private directionsDisplay;
  private directionsService;
  // Location
  private originalLocation;
  private destinationLocation;

  private tumbols = [];
  // FormGroup
  group: FormGroup;
  // Form
  cart: CartForm;

  constructor(
    private cartService: CartService,
    private router: Router,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.cart = new CartForm();
    this.cart = this.cartService.retrieve();
    this.cart.address.district = 'อำเภอเมืองเชียงราย'
    this.cart.address.province = 'จ.เชียงราย'

    this.cart.store = new Store();
    this.cart.store.storeName = 'Biwswalke Shop'

    if (!this.cart.order.paymentType) {
      this.cart.order.paymentType = 'T';
    }
    this.initialTumbol()
    this.initialFormGroup()
  }

  retrieveData() {
    this.cart = new CartForm();
    this.cart = this.cartService.retrieve();
    this.cart.address.district = 'อำเภอเมืองเชียงราย'
    this.cart.address.province = 'จ.เชียงราย'
    this.cart.store.storeName = 'Biwswalke Shop'
    if (!this.cart.order.paymentType) {
      this.cart.order.paymentType = 'T';
    }
  }

  initialTumbol() {
    this.tumbols = [];
    if (this.cart.address.district) {
      for (let tumbol of subDistrictData) {
        if (tumbol.district.endsWith(this.cart.address.district)) {
          this.tumbols.push(tumbol)
        }
      }
    }
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

  initMap() {
    this.originalLocation = { lat: 20.1082023, lng: 99.8738022 };
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      center: this.originalLocation,
    });
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map
    });

    this.directionsDisplay.addListener('directions_changed', () => {
      const origin = this.directionsDisplay.getDirections().request.origin;
      const destination = this.directionsDisplay.getDirections().request.destination;
      if (!destination.location) {
        if (!destination.query) {
          this.destinationLocation = { lat: destination.lat(), lng: destination.lng() };
          this.map.setCenter(this.destinationLocation);
          this.displayRoute();
        }
      }
      if (!origin.location) {
        this.displayRoute();
      }
    });
    this.initialCurrentLocation();
  }

  initialCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.destinationLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.displayRoute();
      });
    }
    else {
      this.destinationLocation = this.originalLocation;
      this.displayRoute();
    }
  }

  displayRoute() {
    this.directionsService.route({
      origin: this.originalLocation,
      destination: this.destinationLocation,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);

        if (!this.destinationLocation.lat) {
          this.geocoder.geocode({ 'address': this.destinationLocation }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                this.destinationLocation = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
                this.geocodeLatLng();
              } else {
                console.error('No results found');
              }
            }
          });
        } else {
          this.geocodeLatLng();
        }
        this.distanceMatrix();
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  distanceMatrix() {
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [this.originalLocation],
      destinations: [this.destinationLocation],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      if (status !== 'OK') {
        console.error('Error was: ' + status);
      } else {
        // var originDista = response.originAddresses;
        // var destinationDista = response.destinationAddresses;
        var result = response.rows[0].elements[0];
        var distance = result.distance.text;
        // Set data
        // this.originRef.nativeElement.innerHTML = originDista;
        this.destinationRef.nativeElement.innerHTML = this.cart.address.subDistrict + ' ' + this.cart.address.district + ' ' + this.cart.address.postcode;
        var numDistance = distance.split(" ", 1);
        let deliveryCost = numDistance[0] * 6;
        let strCost = deliveryCost.toString().split('.', 1)[0];
        let intCost = Number(strCost);
        this.distanceRef.nativeElement.innerHTML = numDistance[0];
        this.diliveryRef.nativeElement.innerHTML = strCost;
        this.diliveryCostRef.nativeElement.innerHTML = '฿ ' + intCost;
        this.cart.order.deliveryCost = intCost;
        this.calculateTotal();
      }
    });
  }

  geocodeLatLng() {
    this.geocoder.geocode({ 'location': this.destinationLocation }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          let country = '';
          for (let addrComponent of results[0].address_components) {
            switch (addrComponent.types[0]) {
              case 'country':
                country = addrComponent.short_name;
                break;
              case 'postal_code':
                this.group.patchValue({ postcode: addrComponent.short_name })
                this.cart.address.postcode = addrComponent.short_name;
                break;
              case 'locality':
                this.group.patchValue({ subDistrict: addrComponent.long_name })
                this.cart.address.subDistrict = addrComponent.short_name;
                for (let sub of results[0].address_components) {
                  if (sub.types[0] === 'political') {
                    this.group.patchValue({ subDistrict: sub.long_name })
                    this.cart.address.subDistrict = sub.long_name;
                  }
                }
                break;
            }
          }
          if (country.endsWith('TH')) {
            this.checkArea();
          } else {
            this.initialCurrentLocation();
          }
        } else {
          console.error('No results found');
        }
      }
    });
  }

  onChangeDestination() {
    this.destinationLocation = '';
    if (this.group.value.subDistrict) {
      this.destinationLocation += this.group.value.subDistrict;
    }
    this.destinationLocation += this.cart.address.district + ' ' + this.cart.address.province
    this.displayRoute();
  }


  calculateTotal() {
    this.cart = this.cartService.calculateFinalPrice(this.cart);
    this.finalTotelRef.nativeElement.innerHTML = '฿ ' + this.cart.order.finalTotal;
  }

  checkArea() {
    let subDistrict = this.group.value.subDistrict;
    let bool = false;
    if (subDistrict) {
      for (let tumbol of this.tumbols) {
        if (tumbol.key === subDistrict) {
          bool = true;
        }
      }
      if (!bool) {
        this.initialCurrentLocation();
      }
    }
  }
}
