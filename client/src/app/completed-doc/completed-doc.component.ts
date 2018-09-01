import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';

@Component({
  selector: 'app-completed-doc',
  templateUrl: './completed-doc.component.html',
  styleUrls: ['./completed-doc.component.css']
})
export class CompletedDocComponent implements OnInit {
   details: UserDetails;
   fullname: String;
   userid: String;
   useremail: String;
   location: any;
   cityname: String;
   sendername:string;
   signedlocation:string;
   signeddate:string;
   signedtime:string;
   signedip:string;
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
      this.http.post(this.AppComponent.BASE_URL+'/api/doccompletedbyme' , {useremail :this.useremail})
      .subscribe(data => {
        this.documentdetail = data;
        this.documents = this.documentdetail.message;
      });
    });
  }


  setdetail(name,location,date,time,ip) {
   this.sendername = name;
   this.signedlocation = location;
   this.signeddate = date;
   this.signedtime = time;
   this.signedip = ip;
  }

}
