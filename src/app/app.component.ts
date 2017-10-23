import { LoadingService } from './services/loading.service';
import { AuthService } from "./services/auth.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  loading = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.status.subscribe((val: boolean) => {
      this.loading = val;
    });
  }
}
