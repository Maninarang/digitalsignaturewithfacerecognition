import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails } from '../authentication.service';


@Component({
  selector: 'app-documentdetail',
  templateUrl: './documentdetail.component.html',
  styleUrls: ['./documentdetail.component.css']
})
export class DocumentdetailComponent implements OnInit {
  documents: any;
  documentdetail: any;
   details: any;
   fullname: any;
   @ViewChild('videoPlayer') videoplayer: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthenticationService,
    // private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      console.log(user);


      this.details = user;
      this.fullname = this.details.name;


    });
    this.activatedRoute.params.subscribe((params: Params) => {
      const documentid = params['documentid'];
      // console.log(params);
      this.http.get('https://mybitrade.com:3001/api/documentdetail/' + documentid)
        .subscribe(data => {
          console.log(data);
          this.documentdetail = data;
          this.documents = this.documentdetail.data;
        });
    });
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
}
}
