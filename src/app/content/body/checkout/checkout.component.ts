import { Store } from '../../../models/store';
import { Observable } from 'rxjs/Rx';
import { LoadingService } from './../../../services/loading.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartForm } from '../../../forms/cart';
import { CartService } from '../../../services/cart.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { mapStyle, subDistrict } from '../../../dataset';

declare var google: any;
declare var document: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapRef: ElementRef;
  // @ViewChild('origin') originRef: ElementRef;
  @ViewChild('destination') destinationRef: ElementRef;
  @ViewChild('distance') distanceRef: ElementRef;
  @ViewChild('dilivery') diliveryRef: ElementRef;
  distan: string = '';
  private geocoder = new google.maps.Geocoder;
  private directionsDisplay = new google.maps.DirectionsRenderer;
  private map;
  private originalLocation;

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
    Promise.all([
      this.initMap()
    ])
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
      for (let tumbol of subDistrict) {
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
    const location = new google.maps.LatLng(19.8162363, 99.6089084);
    const option = {
      center: location,
      zoom: 7,
      styles: mapStyle
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, option);
    this.directionsDisplay.setMap(this.map);
    this.initialCurrentLocation();


    // On Click
    this.map.addListener('click', (event) => {
      var destinationDistance = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      this.displayMapRoute(destinationDistance, 'L')
    });
  }

  initialCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        var destinationDistance = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.displayMapRoute(destinationDistance, 'L');
      });
    } else {
      this.displayMapRoute(this.originalLocation, 'L');
    }
  }

  displayMapRoute(destinationDistance, type) {
    switch (type) {
      case 'L':
        this.geocodeLatLng(destinationDistance);
        break;
      case 'A':
        this.geocodeAddress(destinationDistance);
        break;
    }
    var directionsService = new google.maps.DirectionsService;
    directionsService.route({
      origin: this.originalLocation,
      destination: destinationDistance,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        this.distanceMatrix(destinationDistance);
      }
    });
  }

  distanceMatrix(destinationDistance) {
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [this.originalLocation],
      destinations: [destinationDistance],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      if (status !== 'OK') {
        console.error('Error was: ' + status);
      } else {
        var originDista = response.originAddresses;
        var destinationDista = response.destinationAddresses;
        var result = response.rows[0].elements[0];
        var distance = result.distance.text;
        // Set data
        // this.originRef.nativeElement.innerHTML = originDista;
        this.destinationRef.nativeElement.innerHTML = destinationDista;
        this.distanceRef.nativeElement.innerHTML = distance;
        var numDistance = distance.split(" ", 1); 
        let deliveryCost = numDistance[0] * 6;
        this.diliveryRef.nativeElement.innerHTML = deliveryCost.toString().split('.', 1)[0];
      }
    });
  }

  geocodeLatLng(destinationCode) {
    this.geocoder.geocode({ 'location': destinationCode }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0])
          for (let addrComponent of results[0].address_components) {
            switch (addrComponent.types[0]) {
              case 'postal_code':
                this.group.patchValue({ postcode: addrComponent.short_name })
                break;
              case 'locality':
                this.group.patchValue({ subDistrict: addrComponent.long_name })
                for (let sub of results[0].address_components) {
                  if (sub.types[0] === 'political') {
                    this.group.patchValue({ subDistrict: sub.long_name })
                  }
                }
                break;
            }
          }
        } else {
          console.error('No results found');
        }
      }
    });
  }

  geocodeAddress(destinationCode) {
    this.geocoder.geocode({ 'address': destinationCode }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.geocodeLatLng(results[0].geometry.location)
        } else {
          console.error('No results found');
        }
      }
    });
  }

  onChangeDestination() {
    let destinationTarget = '';
    if (this.group.value.subDistrict) {
      destinationTarget += this.group.value.subDistrict;
    }
    destinationTarget += this.cart.address.district + ' ' + this.cart.address.province
    this.displayMapRoute(destinationTarget, 'A')
  }
}
