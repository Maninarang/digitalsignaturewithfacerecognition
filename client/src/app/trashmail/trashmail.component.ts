import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';

@Component({
  selector: 'app-trashmail',
  templateUrl: './trashmail.component.html',
  styleUrls: ['./trashmail.component.css']
})
export class TrashmailComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  useremail:string;
  checkedmails:any;
  checkedid=[];
  mails:any;
  email:string;
  trashmails:any;
  isSelected = false;
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
     this.http.post(this.AppComponent.BASE_URL+'/api/gettrashmail', {userid:this.userid})
     .subscribe(data => {
       this.mails = data;
       this.trashmails= this.mails.data;
     });
    });
  }

  checkAll(ev) {
    this.trashmails.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
  }
  
  isAllChecked() {
    if(this.isSelected == true)
    return this.trashmails.every(_ => _.selected);
  }

  movetosent() {
    this.checkedmails= this.trashmails.filter(_ => _.selected);
    if(this.checkedmails.length == 0 ) {
      alert('Please Check At Least One Record')
    }
    else {
      if(confirm("Are you sure to move the selected records")) {
        this.checkedid = [];
       for( let i = 0;i<this.checkedmails.length;i++) {
        this.checkedid.push({id:this.checkedmails[i]._id});
       }
       this.http.post(this.AppComponent.BASE_URL+'/api/movesmartmailstosent', {mailid:this.checkedid})
       .subscribe(data => {
        this.http.post(this.AppComponent.BASE_URL+'/api/gettrashmail', {userid:this.userid})
        .subscribe(data => {
          this.mails = data;
          this.trashmails= this.mails.data;
        });
       });  
    }

    }
  }

  deletesmartmail() {
    this.checkedmails= this.trashmails.filter(_ => _.selected);
    if(this.checkedmails.length == 0 ) {
      alert('Please Check At Least One Record')
    }
    else {
      if(confirm("Are you sure to empty the trash")) {
        this.checkedid = [];
       for( let i = 0;i<this.checkedmails.length;i++) {
        this.checkedid.push({id:this.checkedmails[i]._id});
       }
       this.http.post(this.AppComponent.BASE_URL+'/api/deletesmartmail', {mailid:this.checkedid})
       .subscribe(data => {
        this.http.post(this.AppComponent.BASE_URL+'/api/gettrashmail', {userid:this.userid})
        .subscribe(data => {
          this.mails = data;
          this.trashmails= this.mails.data;
        });
       });  
    }

    }
  }

  emptytrash() {
    this.http.post(this.AppComponent.BASE_URL+'/api/emptysmartmailtrash', {userid:this.userid})
    .subscribe(data => {
      this.mails = data;
      this.trashmails= this.mails.data;
    });
  }

}
