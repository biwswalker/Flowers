import { CartService } from './services/cart.service';
import { LoadingService } from './services/loading.service';
import { AuthService } from "./services/auth.service";
import { Component } from "@angular/core";
declare var google: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  loading = false;
  private geocoder = new google.maps.Geocoder;

  constructor(private loadingService: LoadingService, private cartService: CartService) { }

  ngOnInit() {
    // this.cartService.empty();
    this.loadingService.status.subscribe((val: boolean) => {
      setTimeout(() => { this.loading = val, 0 })
    });
    this.initMap();
  }


  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let location = { lat: position.coords.latitude, lng: position.coords.longitude };
        let district = '';
        this.geocoder.geocode({ 'location': location }, (results, status) => {
          if (results[0]) {
            for (let districtDetect of results[0].address_components) {
              if (districtDetect.types[0] === 'administrative_area_level_2') {
                district = districtDetect.long_name
              }
            }
          } else {
            console.error('No results found');
          }
          this.cartService.changeDistrict(district)
        });
      });
    }
  }
}
