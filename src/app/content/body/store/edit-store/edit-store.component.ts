import { ProductService } from '../../../../services/product.service';
import { AlertService } from '../../../../services/alert.service';
import { UtilsService } from '../../../../services/utils.service';
import { StoreService } from '../../../../services/store.service';
import { Location } from '../../../../models/location';
import { Store } from '../../../../models/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { subDistrictData } from '../../../../dataset';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.css', '../store.component.css']
})
export class EditStoreComponent implements OnInit, AfterViewInit {

  @Output() mode = new EventEmitter<string>();
  currentMode = 'I';

  @ViewChild('map') mapRef: ElementRef;
  // Google
  private map;
  private marker;
  private geocoder = new google.maps.Geocoder;
  private directionsDisplay;
  private directionsService;

  // FormGroup
  group: FormGroup;

  private store = new Store();
  @Input() updateStore = new Store();

  private tumbols = [];

  constructor(private storeService: StoreService, private utilsService: UtilsService, private alertService: AlertService, private productService: ProductService) { }

  ngOnInit() {
    console.log(this.updateStore)
    console.log(this.updateStore.storeId)    
    window.scrollTo(0, 0);
    this.store = new Store();
    this.store.location = new Location();
    this.store.status = 'Y';
    this.store.province = 'จ.เชียงราย';
    this.resetFormGroup();
  }
  onUpdate(){
    console.log(this.updateStore)
  }

  ngAfterViewInit() {
    this.initMap();
  }

  resetFormGroup() {
    this.group = new FormGroup({
      storeName: new FormControl(this.store.storeName, Validators.required),
      status: new FormControl(this.store.status, Validators.required),
      province: new FormControl(this.store.province, Validators.required),
      district: new FormControl(this.store.district, Validators.required),
      subDistrict: new FormControl(this.store.subDistrict, Validators.required),
      lat: new FormControl(this.store.location.lat),
      lng: new FormControl(this.store.location.lng),
    });
  }

  onChangeDistrict() {
    this.group.patchValue({ subDistrict: '' });
    this.onChangeDestination();
    this.initialTumbol();
  }

  initialTumbol() {
    this.tumbols = [];
    if (this.group.value.district) {
      for (let tumbol of subDistrictData) {
        if (tumbol.district === this.group.value.district) {
          this.tumbols.push(tumbol)
        }
      }
    }
  }

  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let location = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.map = new google.maps.Map(this.mapRef.nativeElement, {
          zoom: 14,
          center: location
        });

        this.marker = new google.maps.Marker({
          position: location,
          map: this.map,
          draggable: true
        });

        this.marker.addListener('dragend', (event) => {
          let latlng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
          this.geocodeLatLng(latlng);
        });
      });
    }
  }

  onChangeDestination() {
    let location = '';

    if (this.group.value.subDistrict) {
      location += this.group.value.subDistrict;
    }
    if (this.group.value.district) {
      location += this.group.value.district;
    }
    location += ' ' + this.store.province

    this.geocoder.geocode({ 'address': location }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          let latlng = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
          this.geocodeLatLng(latlng);
          this.setMarker(latlng);
        } else {
          console.error('No results found');
        }
      }
    });
  }

  geocodeLatLng(latlng) {
    this.geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === 'OK') {
        this.group.patchValue({ lat: latlng.lat, lng: latlng.lng })
        if (results[0]) {
          for (let districtDetect of results[0].address_components) {
            if (districtDetect.types[0] === 'administrative_area_level_2') {
              this.group.patchValue({ district: districtDetect.long_name })
              this.initialTumbol();
            }
          }
          for (let sucDistrictDetect of results[0].address_components) {
            if (sucDistrictDetect.types[0] === 'locality') {
              this.group.patchValue({ subDistrict: sucDistrictDetect.long_name })
              for (let sub of results[0].address_components) {
                if (sub.types[0] === 'political') {
                  this.group.patchValue({ subDistrict: sub.long_name })
                }
              }
            }
          }
        } else {
          console.error('No results found');
        }
      }
    });
  }

  setMarker(location) {
    this.map.setCenter(location);
    this.marker.setPosition(location)
  }


  onBack() {
    this.mode.emit('S')
  }

  onClickSubmit() {
    if (this.group.valid) {
      this.store.storeId = this.utilsService.generateUUID();
      this.store.storeName = this.group.value.storeName;
      this.store.district = this.group.value.district;
      this.store.subDistrict = this.group.value.subDistrict;
      this.store.status = this.group.value.status;
      let location = new Location();
      location.lat = this.group.value.lat;
      location.lng = this.group.value.lng;
      this.store.location = location;
      const result = this.storeService.setStore(this.store)
      window.scrollTo(0, 0);
      if (result === 'Duplicated') {
        this.alertService.warn("ที่ตั้งอำเภอซ้ำ กรุณาตรวจสอบอำเภอ");
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
      } else {
        result.then(() => {
          this.group.reset();
          this.ngOnInit();
          // 
          // this.productService.fetchProductListData();
          this.alertService.success("บันทึกร้านค้าเรียบร้อย");
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
        })
          .catch(() => {
            this.alertService.error("เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ");
            setTimeout(() => {
              this.alertService.clear();
            }, 10000);
          })
      }
    }
  }
}
