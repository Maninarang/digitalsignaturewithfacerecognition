import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  error: any;
  USER: any;
  userDetails: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) { }
  ngOnInit() {
    // }
    // user() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const userid = params['userid'];
      // console.log(params);
      this.http.get('https://mybitrade.com:3001/api/confirmuser/' + userid)
        .subscribe(data => {
          console.log(data);
          this.USER = data;
          this.userDetails = this.USER.data;
          localStorage.setItem('useremail', this.USER.data.email);
          this.router.navigateByUrl('/login');
        },
          err => {
            this.error = ' User Not Found ';
          }
        );
    });
  }

}
