import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { AppComponent} from '../app.component';

@Component({
  selector: 'app-contactmail',
  templateUrl: './contactmail.component.html',
  styleUrls: ['./contactmail.component.css']
})
export class ContactmailComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  email:string;
  csvcontacts: any;
  mycsvcontact:any;
  checkedid=[];
  searchdata:string;
  checkedcontacts:any;
  isSelected = false;
  loading = false;
   

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent:AppComponent) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;
     // console.log(this.useremail)
     this.http.post(this.AppComponent.BASE_URL+'/api/getcsvcontacts', {userid:this.userid})
     .subscribe(data => {
       this.csvcontacts = data;
       this.mycsvcontact = this.csvcontacts.data;
     });
    });
  }

  uploadcsvcontacts(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      this.loading = true;
      formData.append('filetoupload', file, file.name);
      formData.append('userid', this.userid);
      this.http.post(this.AppComponent.BASE_URL+'/api/uploadsmartmailcsv', formData)
        .subscribe(data => {
          this.loading = false;
          event.target.value = '';
          this.http.post(this.AppComponent.BASE_URL+'/api/getcsvcontacts', {userid:this.userid})
          .subscribe(data => {
            this.csvcontacts = data;
            this.mycsvcontact = this.csvcontacts.data;
          });
        });
    }
  }
  

  updatecontact(id,name,company,contact,email) {
    this.http.post(this.AppComponent.BASE_URL+'/api/updatesmartmailcontact', {id:id,name:name,company:company,contact:contact,email:email})
        .subscribe(data => {
          alert('Record Update Successfully');
          this.http.post(this.AppComponent.BASE_URL+'/api/getcsvcontacts', {userid:this.userid})
          .subscribe(data => {
            this.csvcontacts = data;
            this.mycsvcontact = this.csvcontacts.data;
          });
                });
  }

  filterarray() {
    var search = this.searchdata;
    var filteredarray = this.mycsvcontact.filter(function (el) {
   // return el.fromemail == search || el.toemail == search || el.subject == search

   return  el.name.indexOf(search)>-1 || el.company.indexOf(search)>-1 || el.email.indexOf(search)>-1 || el.contact.indexOf(search)>-1
    });
    this.mycsvcontact=filteredarray;
  }

  checkAll(ev) {
    this.mycsvcontact.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
  }
  
  isAllChecked() {
    if(this.isSelected == true)
    return this.mycsvcontact.every(_ => _.selected);
  }

  deletecontact() {
    this.checkedcontacts= this.mycsvcontact.filter(_ => _.selected);
    if(this.checkedcontacts.length == 0 ) {
      alert('Please Check At Least One Record')
    }
    else {
      if(confirm("Are you sure to delete the selected records")) {
        this.checkedid = [];
       for( let i = 0;i<this.checkedcontacts.length;i++) {
        this.checkedid.push({id:this.checkedcontacts[i]._id});
       }
       this.http.post(this.AppComponent.BASE_URL+'/api/deletesmartmailcontact', {contactid:this.checkedid})
       .subscribe(data => {
        this.http.post(this.AppComponent.BASE_URL+'/api/getcsvcontacts', {userid:this.userid})
        .subscribe(data => {
          this.csvcontacts = data;
          this.mycsvcontact = this.csvcontacts.data;
        });
       });  
    }
        }
  }

  downloadascsv() {
   var options = { 
      headers: ["Id","Name", "Company", "Email","Contact","Email Sent"]
    };
   new Angular5Csv(this.mycsvcontact, 'Report',options);

  }
}
