import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@Component({
  selector: 'app-actionrequired',
  templateUrl: './actionrequired.component.html',
  styleUrls: ['./actionrequired.component.css']
})
export class ActionrequiredComponent implements OnInit {
   details: UserDetails;
   fullname: String;
   userid: String;
   documents: any;
   documentdetail: any;
   digitalpath:string;
   constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.http.get('https://mybitrade.com:3001/api/mydocuments/' + this.userid)
      .subscribe(data => {
       this.documentdetail = data;
       this.documents = this.documentdetail.data;
       this.digitalpath = localStorage.getItem('digitalpath')
    //   console.log(this.documents);
      });
    });
  }

  logout() {
    this.auth.logout();
  }

}
