import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EmailService {

  constructor(private http: Http) { }

  mailUrl = "https://us-central1-flowers-flow.cloudfunctions.net/sendmail";

  onSubmitForm() {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.mailUrl, JSON.stringify({ gg: 'biwswalker' }), { headers: headers }).subscribe();
  }

  sendEmail() {
    let url = "https://us-central1-flowers-flow.cloudfunctions.net/httpEmail";
    let params: URLSearchParams = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    params.set('to', 'jannarong.san@gmail.com');
    params.set('from', 'noreply@flowers-flow.firebaseapp.com');
    params.set('subject', 'test-email');
    params.set('content', 'Hello World');

    return this.http.post(url, params, { headers: headers }).subscribe();
    // return this.http.post(url, params, { headers: headers })
    // .toPromise()
    // .then(res => {
    //   console.log(res)
    // })
    // .catch(err => {
    //   console.log(err)
    // })

  }
}
