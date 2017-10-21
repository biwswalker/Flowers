import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AlertService } from "./../../../services/alert.service";
import { Router } from "@angular/router";
import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import * as firebase from "firebase";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  // FormGroup
  group: FormGroup;

  // LOADING
  loading = false;

  isLoggedin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.isLoggedin = false;
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.isLoggedin = true;
    //     // this.router.navigateByUrl("/admin/product-manage");
    //   }
    // });
    this.resetFormGroup();
  }

  resetFormGroup() {
    this.group = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onSignin() {
    if (this.group.valid) {
      if (
        this.group.value.username === "biwswalker" &&
        this.group.value.password === "1234"
      ) {
        this.isLoggedin = true;
        this.router.navigateByUrl("/admin/product-manage");
      }
    }
  }
}
