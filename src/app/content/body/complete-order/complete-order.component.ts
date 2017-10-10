import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrls: ['./complete-order.component.css']
})
export class CompleteOrderComponent implements OnInit, OnDestroy {

  subscribe;
  orderId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscribe = this.route
      .queryParams
      .subscribe(params => {
        this.orderId = params['orderId'];
      });
    if (!this.orderId){
      this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
