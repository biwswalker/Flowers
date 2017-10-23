import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
@Injectable()
export class LoadingService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  loading(value: boolean) {
    this.status.next(value);
  }
}
