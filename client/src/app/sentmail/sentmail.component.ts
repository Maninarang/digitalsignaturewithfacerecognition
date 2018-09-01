import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';

@Component({
  selector: 'app-sentmail',
  templateUrl: './sentmail.component.html',
  styleUrls: ['./sentmail.component.css']
})
export class SentmailComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  useremail:string;
  mails:any;
  sentmails:any;
  checkedmails:any;
  checkedid=[];
  isSelected = false;
  searchdata:string;
  email: string;
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
      this.email = this.details.email;
     // console.log(this.useremail)
     this.http.post(this.AppComponent.BASE_URL+'/api/getsmartmail', {userid:this.userid})
     .subscribe(data => {
       this.mails = data;
       this.sentmails= this.mails.data;
     });
    });
  }

  filterarray() {
    var search = this.searchdata;
    var filteredarray = this.mails.data.filter(function (el) {
   // return el.fromemail == search || el.toemail == search || el.subject == search

   return  el.fromemail.indexOf(search)>-1 || el.toemail.indexOf(search)>-1 || el.subject.indexOf(search)>-1
    });
    this.sentmails=filteredarray;
  }

  checkAll(ev) {
    this.sentmails.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
  }
  
  isAllChecked() {
    if(this.isSelected == true)
    return this.sentmails.every(_ => _.selected);
  }

  movetotrash() {
    this.checkedmails= this.sentmails.filter(_ => _.selected);
    if(this.checkedmails.length == 0 ) {
      alert('Please Check At Least One Record')
    }
    else {
      if(confirm("Are you sure to delete the selected records")) {
        this.checkedid = [];
       for( let i = 0;i<this.checkedmails.length;i++) {
        this.checkedid.push({id:this.checkedmails[i]._id});
       }
       this.http.post(this.AppComponent.BASE_URL+'/api/movesmartmailstotrash', {mailid:this.checkedid})
       .subscribe(data => {
        this.http.post(this.AppComponent.BASE_URL+'/api/getsmartmail', {userid:this.userid})
        .subscribe(data => {
          this.mails = data;
          this.sentmails= this.mails.data;
        });
       });  
    }

    }
  }
}
