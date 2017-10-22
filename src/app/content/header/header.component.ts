import { Router } from "@angular/router";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import * as firebase from "firebase";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  displayName: any;
  logedin = false;
  constructor(private authService: AuthService, private router: Router) {
    this.logedin = false;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.logedin = true;
        this.displayName = user.displayName;
      }
    });
  }

  ngOnInit() {}

  logout() {
    window.scrollTo(0, 0);
    this.authService
      .signout()
      .then(res => {
        this.router.navigateByUrl("/");
        window.location.reload();
      })
      .catch(error => {
        console.log(error.message);
      });
  }
}
