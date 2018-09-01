import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  public confirm = null;
  fullname: String;
  details: any;
  constructor(private auth: AuthenticationService,
    // private fb: FormBuilder,
    private router: Router) {
    this.confirm = localStorage.getItem('confirm');
    if (this.confirm !== null) {
      auth.logout();
    } else {
      if (auth.isLoggedIn()) {
        router.navigate(['landing']);
      }
    }
  }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
   //   console.log(user)
      if (user.status === 'unverified' ) {
localStorage.clear();
this.router.navigateByUrl('/login');
      }else {
        this.details = user;
        this.fullname = this.details.name;
      }
    },
    err => {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  
  );
  }
  // constructor(private auth: AuthenticationService, private router: Router, private http: HttpClient) {


  // }
  logout() {
    this.auth.logout();
  }
}
