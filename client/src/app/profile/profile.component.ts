import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Component } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  details: UserDetails;
  public res: any;
  public response :any;
  public msg :any;
  public class :any;
  public test:any;
  public token:'';
  public fullname: string;
  public firstname: string;
  public lastname: string;
  public shortname :string;
  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    private spinnerService: Ng4LoadingSpinnerService
  ) {}
  ngOnInit() {
   // this.spinnerService.show();
    this.auth.profile().subscribe(user => {
      this.details = user;
//console.log(this.details);
localStorage.setItem('user_id', this.details._id);
//this.details.sec_email =this.details.secEmail
     
     var fullName =this.details.name;
     this.fullname = this.details.name;
     var nameArr=[];
     var lastName='';
     var nameArr=[];
     
     if (fullName) {
      nameArr = fullName.split(' ');

      if (nameArr.length > 2) {
        lastName = nameArr.pop();
        this.details.first_name = nameArr.join(' ');
        this.firstname = nameArr.join(' ');
        this.lastname = lastName;
        this.details.last_name = lastName;
      } else {
        this.firstname = nameArr[0];
        this.lastname = nameArr[nameArr.length - 1];
        this.details.first_name = nameArr[0];
        this.firstname=nameArr[0];
        this.details.last_name = nameArr[nameArr.length - 1];
      }
    }
    //this.spinnerService.hide();
    }, (err) => {
      console.error(err);
   //   this.spinnerService.hide();
    });
  }
  clear() {
    setTimeout(function(){
      console.log('cleR');
      this.response=null;
       this.class="";
       this.msg=""
     }, 0);
  }

  update(){
    //console.log('chill');
    //console.log(this.details);
   // console.log(this.details.phonenumber);
    
   // console.log(this.details.first_name);
    
   // console.log(this.details.last_name);
    
   // console.log(this.details.secEmail);
    // console.log(this.details);
    this.spinnerService.show();

    // const req = this.http.post('http://127.0.0.1:3000/api/update',
    const req = this.http.post('https://mybitrade.com:3001/api/update',  {
      user_id: localStorage.getItem('user_id'),
      phonenumber: this.details.phonenumber,
      email: this.details.email,
      name: this.details.first_name+" "+this.details.last_name,
      secEmail: this.details.secEmail,

    })
      .subscribe(
        res => {
         console.log(res);
         this.response="true";
         this.class="alert alert-success";
         this.msg="Data updated Sucessfully"
      //   window.location.reload();
      

      this.ngOnInit()
      this.spinnerService.hide();
     let element : HTMLElement = document.getElementById('hidemsg') as HTMLElement;
     element.click();
        },
        err => {
          this.response="true";
         this.class="alert alert-danger";
         this.msg="Failed to update data "
       //   console.log("Error occured");
          setTimeout(function(){
        //    console.log('cleR');
            this.response=null;
             this.class="";
             this.msg=""
           }, 9000);
        }
      );
//done but some feilds miss match with backend
  }
 
}
