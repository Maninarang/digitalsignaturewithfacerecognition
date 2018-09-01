import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';
import { Router } from '@angular/router'


@Component({
  selector: 'app-composefiletransfer',
  templateUrl: './composefiletransfer.component.html',
  styleUrls: ['./composefiletransfer.component.css']
})
export class ComposefiletransferComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  useremail:string;
  email: string;
  filename:string;
  emailerror:string;
  loading = false;
  filesToUpload: Array<File> = [];
  filesname = [];
  formData: FormData = new FormData();
  @ViewChild('toemail') toemail: ElementRef;
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('data') data: ElementRef;
  @ViewChild('password') password: ElementRef;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent:AppComponent,
    private router: Router

  ) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;

    });
  }

  fileChange(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    const fileList: FileList = fileInput.target.files;
    const files: Array<File> = this.filesToUpload;
 for(let i =0; i < files.length; i++){
     this.formData.append("uploads[]", files[i], files[i]['name']);
 }
    for(var i = 0;i<fileList.length;i++) {
    const file: File = fileList[i];
    this.filesname.push({filename:file.name});
    }
  }

   removeattachment(name) {
    var attachfiles=[];
    attachfiles=this.formData.getAll("uploads[]"); 
  
    for(var i=0;i<attachfiles.length;i++) {
    //  alert(this.filesname[i].filename)
      if(this.filesname[i].filename === name) {
        this.filesname.splice(i,1);
      }
			if(attachfiles[i].name === name) {
				attachfiles.splice(i,1);
				break;
      }
     
    }
      this.formData.delete("uploads[]");
      for(let i =0; i < attachfiles.length; i++){
        this.formData.append("uploads[]", attachfiles[i], attachfiles[i]['name']);
    } 

   }

   checkEmail(email) {
    var regExp = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regExp.test(email);
    }
    
   validateemail() {
    var emails = this.toemail.nativeElement.value;
    var emailArray = emails.split(",");
    var invEmails = "";
    for(var i = 0; i <= (emailArray.length - 1); i++){
      if(this.checkEmail(emailArray[i])){
        this.emailerror = ''
            } else{
              invEmails += emailArray[i] + "\n";
      }
    }
    if(invEmails != ""){
      this.emailerror = 'Invalid Email: ' + invEmails
     // alert("Invalid emails:\n" + invEmails);
    }
   } 
  sendmail() {
    //  console.log(this.editorContent)
 

          if(this.toemail.nativeElement.value === '')
      {
      this.emailerror = 'Enter a valid Email'
      }
      else {
        var emails = this.toemail.nativeElement.value;
        var emailArray = emails.split(",");
        var invEmails = "";
        for(var i = 0; i <= (emailArray.length - 1); i++){
          if(this.checkEmail(emailArray[i])){
            
                } else{
                  invEmails += emailArray[i] + "\n";
          }
        }
        if(invEmails != ""){
          this.emailerror = 'Invalid Email: ' + invEmails
         // alert("Invalid emails:\n" + invEmails);
        } else {
          this.loading = true;
          this.formData.append('from',this.userid);
          this.formData.append('data',this.data.nativeElement.value);
          this.formData.append('fromemail',this.email);
          this.formData.append('toemail',this.toemail.nativeElement.value);
          this.formData.append('subject',this.subject.nativeElement.value);
          this.formData.append('password',this.password.nativeElement.value);
          this.http.post(this.AppComponent.BASE_URL+'/api/sendfiletransfermail', this.formData)
              .subscribe(data => {
                this.loading = false;
                alert('Mail Sent Successfully');
                this.router.navigateByUrl('/senttransfer');
              });
        }
    
  }

    }

}
