import { Alert, AlertType } from '../../models/enum/alert';
import { AlertService } from '../../services/alert.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  alerts: Alert[] = [];

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }

      // add alert to array
      this.alerts.push(alert);
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'alert alert-success';
      case AlertType.Error:
        return 'alert alert-danger';
      case AlertType.Info:
        return 'alert alert-info';
      case AlertType.Warning:
        return 'alert alert-warning';
    }
  }

  // success(message: string) {
  //   console.log('success');
  //   this.alertService.success(message);
  // }

  // error(message: string) {
  //   console.log('error');
  //   this.alertService.error(message);
  // }

  // info(message: string) {
  //   console.log('info');
  //   this.alertService.info(message);
  // }

  // warn(message: string) {
  //   console.log('warn');
  //   this.alertService.warn(message);
  // }

  // clear() {
  //   console.log('clear');
  //   this.alertService.clear();
  // }

}
