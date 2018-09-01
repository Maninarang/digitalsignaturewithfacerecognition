import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Component({
  selector: 'app-main-side-bar',
  templateUrl: './main-side-bar.component.html',
  styleUrls: ['./main-side-bar.component.css']
})
export class MainSideBarComponent implements OnInit {
  public fullname: String;
  phonenumber: String;
  image: String;
  userid:String;
  details: any;
  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {

      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.phonenumber = this.details.phonenumber;
      this.image = this.details.image;
   
  });
  }

}
