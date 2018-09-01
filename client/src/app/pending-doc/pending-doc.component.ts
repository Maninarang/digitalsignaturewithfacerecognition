import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';

@Component({
  selector: 'app-pending-doc',
  templateUrl: './pending-doc.component.html',
  styleUrls: ['./pending-doc.component.css']
})
export class PendingDocComponent implements OnInit {

  details: UserDetails;
  fullname: String;
  userid: String;
  useremail: String;
  location: any;
  cityname: String;
  documentdetail:any;
  documents:any;
  constructor(
   private http: HttpClient,
   private auth: AuthenticationService,
   private AppComponent:AppComponent

 ) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.useremail = this.details.email;
      this.http.post(this.AppComponent.BASE_URL+'/api/docpendingbyme' , {useremail :this.useremail})
      .subscribe(data => {
      this.documentdetail = data;
      this.documents = this.documentdetail.message;
     // console.log(this.documents);
      });
    });
  }

}
