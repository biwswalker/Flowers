import { AlertService } from './../../../services/alert.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.router.navigateByUrl('/');
      }
    })
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  loginWithFacebook() {
    this.loading = true;
    window.scrollTo(0, 0);
    this.authService.singinWithFacebook().then(res => {
      this.loading = false;
      this.router.navigateByUrl('/');
    }).catch(error => {
      this.loading = false;
      this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
      setTimeout(() => {
        this.alertService.clear();
      }, 5000);
      window.scrollTo(0, 0)
    });

  }

  loginWithGoogle() {
    window.scrollTo(0, 0);
    this.loading = true;
    this.authService.singinWithGoogle().then(res => {
      this.loading = false;
      this.router.navigateByUrl('/');
    }).catch(error => {
      this.loading = false;
      this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
      setTimeout(() => {
        this.alertService.clear();
      }, 5000);
      window.scrollTo(0, 0)
    });
  }

}
