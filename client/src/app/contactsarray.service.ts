import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactsarrayService {
  contacts = [];
  contactList: any;
  constructor(private http: HttpClient) { }

  pushcontacts(firstName, lastName, email, address, subject, message, type, userid) {
     const emailalreadyexist = this.contacts.some(function (el) {
    return el.email === email;
  });
  if (!emailalreadyexist) {
     return this.http.post('https://mybitrade.com:3001/api/addnewparticipant',
     { firstName: firstName, lastName: lastName, email: email, address: address,
       subject: subject, message: message, userId: userid })
       .subscribe(data => {
        this.contactList = data;
        if (this.contactList.message === 1) {
              this.contacts.push({name: firstName + ' ' + lastName, type: type, email: email });
              return this.contacts;
              // this.addparticipantForm.reset();
              // this.addparticipantModal.close();
             } else {
            //  this.error = 'This Email is already in your Contacts.You can add from there!!!';
             }
       // return res.json();
      });
    //  .subscribe(data => {
    //    this.contactList = data;
    //    if (this.contactList.message === 1) {
    //     this.contacts.push({name: firstName + ' ' + lastName, type: type, email: email });
    //     // this.addparticipantForm.reset();
    //     // this.addparticipantModal.close();
    //    } else {
    //   //  this.error = 'This Email is already in your Contacts.You can add from there!!!';
    //    }
    //  }, err => {
    //   // this.error = 'Something Went Wrong.Please Try Again !!!';
    //  });
  }
  }
}
