import { Component, OnInit, Inject, ViewChild, ElementRef, Input, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService, UserDetails, TokenPayload } from '../authentication.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AppComponent} from '../app.component';
import { timer } from 'rxjs/observable/timer'; // (for rxjs < 6) use 'rxjs/observable/timer'
import { take, map } from 'rxjs/operators';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';


let RecordRTC = require('recordrtc/RecordRTC.min');
//const url = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'noSanitize' })
@Component({
  selector: 'app-signpdf',
  templateUrl: './newsignpdf.component.html',
  styleUrls: ['./newsignpdf.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewsignpdfComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    password: '',
    image: '',
    phonenumber: '',
    cpassword: '',
    fname: '',
    lname: '',
    rememberme:''
  };
  html: any;
  documenthtml: SafeHtml;
  details: UserDetails;
  userid: string;
  userId:string;
  useremail: String;
  username: String;
  eligibility: any;
  eligible: Number;
  unknownimage: any;
  documentid: any;
  usertosign: any;
  location:any;
  cityname:string;
  loading = true;
  camera = null;
  userinitials:any;
  imagecaptured = null;
  webcamImage: WebcamImage = null;
  showWebcam = false;
  faceresponse: any;
  error = null;
  showpdf = true;
  withimage = true;
  fileslength: any;  noofpages : number;countDown
  clas = null;
  conveniancecount: Number;
  stream: MediaStream;
  recordRTC: any;
  trigger: Subject<void> = new Subject<void>();
  @ViewChild('video') video;
  @ViewChild('gethtml') gethtml: any;
  @ViewChild('initialModal') initialModal: any;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router,
    private sanitized: DomSanitizer,
    private AppComponent:AppComponent

  ) { }

  ngOnInit() {
  //  this.loadscript();
    var ip = window.location.origin;
   // console.log('ip here->', ip);
    // alert(pathname);
    // alert(url);

    this.conveniancecount = 0;
    // this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      const documentid = params['documentid'];
      const userid = params['userid'];
      this.userId = params['userid'];
      const usertosign = params['usertosign'];
      this.auth.profile().subscribe(user => {
      //  console.log('mani'+user)
        this.details = user;
        this.userid = this.details._id;
        this.useremail = this.details.email;
        this.username = this.details.name;
        this.userinitials = this.username.match(/\b\w/g) || [];
        this.userinitials = ((this.userinitials.shift() || '') + (this.userinitials.pop() || '')).toUpperCase();
        this.documentid = documentid;
        this.usertosign = usertosign;
       // alert(this.usertosign)
        this.http.get('https://mybitrade.com:3001/api/checkeligibility/' + this.useremail + '/' + documentid + '/' + userid)
          .subscribe(data => {
            this.eligibility = data;
            this.eligible = this.eligibility.data;
            if (this.eligible !== 1) {
              this.router.navigateByUrl('/');
            } else {
              this.http.get('https://mybitrade.com:3001/api/getdocument/' + this.userid + '/' + documentid)
                .subscribe(
                  // tslint:disable-next-line:no-shadowed-variable
                  data => {


                    this.html = data;
                    this.documenthtml = this.html.data.documenthtml;
                    if(this.html.data.documentstatus == 'Rejected') {
                      this.router.navigateByUrl('/rejectedmassage');
                   } else {
                    this.withimage = this.html.data.withimage;
                    this.http.post('https://mybitrade.com:3001/api/pdfdetail', { pdfid: this.html.data.documentid })
                    .subscribe(data => {
                      // this.pdfimages = data;
                      let i: number;
                      this.fileslength = data;
                      this.noofpages = this.fileslength.fileslength;
                    });
                    if(this.withimage === true){
                      this.showpdf = false;
                      this.loading = false;
                    } else {
                      this.showpdf = true;
                      this.loading = false;
                      this.initialModal.open();
                      setTimeout(() => {
                        $(document).on('blur', '.gettext', function () {
                          $(this).html($(this).val() as any)
                      });
                        var number = 0;
                        this.conveniancecount = 13;
                        const pathname = window.location.pathname; // Returns path only
                        const url = window.location.href;
                        const lastslashindex = url.lastIndexOf('/');
                        this.clas = url.substring(lastslashindex + 1);
                        const result = this.clas;
                        $('div.'+result).show();
                        $('div.appended').not('.'+result).hide();
                        $('.signed').show();
                        $('div.hideme').hide();
                        // if (!$('textarea').hasClass(result)) {
                        //   $('textarea').prop('disabled', true);
                        // }

                        $('textarea').not('.'+result).prop('disabled', true);

                      //  alert(result)
                        const numItems = $('.' + result).length;
                      //  console.log(numItems);
                        // tslint:disable-next-line:max-line-length
                        $('.dell').remove();
                        // $('.gethtml').find('.dell').remove();
                        $('.' + result + '1 div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:100px; font-size: 22px; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;">Click to Sign</button><br>');
                        //  $('.' + result + ' div div').css('pointer-events', 'none');
                        //  $('.' + result + ' div div button').css('cursor', 'pointer');
      
                        // $('.' + result + '1 div div').css('pointer-events', 'none');
                        // alert(this.clas);
                        this.conveniancecount = $('.' + result).length;
      
                        //   alert(this.conveniancecount);
                        // }, 3000);
                        // this.conveniancecount = 56;
                        const y = $('.' + result + '1').position();
                        //alert(y.top)
                        $('html, body').animate({
                          scrollTop: ($('.' + result + '1' ).offset().top + y.top-50)
                        }, 500)
                     //   $('.' + result).click(function () {
                        //   alert(result);
                          // this.conveniancecount=  this.conveniancecount -1;
                          $(document).on('click','.signbutton',function(){
                           // alert('hd')
                            if($(this).parent().prev('textarea').hasClass('gettext')) {
                              $(this).parent().prev('textarea').prev('.form-group').css('opacity',0);
                              // $(this).parent().addClass('ase')
                            }
                            // if($(this).prev('div').prev('textarea').hasClass('gettext')) {
                            //   //$(this).prev('br').remove();
                            //   alert('maniz')
                            //  $(this).prev('div').remove();
                            //   }
                          number++;
                          // let inc = number + 1;
                          $(this).parent().css({
                            'font-family': 'serif',
                            'text-transform': 'lowercase'
                          });
                          $(this).closest('.' + result).css('border', 'none');
                          // alert($(this).text());
                          const strng = $(this).text();
                          // alert(strng)
                          let res = strng.replace('Click to Sign', '');
                          // alert(res)
                          // tslint:disable-next-line:max-line-length
                          $(this).parent().append('<div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);">' + res + '</div>');
                          // $(this).closest('.removeme').css('display', 'none');
                          //   $('html, body').animate({
                          //     'scrollTop' : $(this).closest('.'+result).position().top;
                          //     alert()
                          // });
                          const num = number + 1;
                          // tslint:disable-next-line:max-line-length
                          if($('.' + result + '' + num).hasClass('gettext')) {
                           // alert('hi')
                            $('.' + result + '' + num).next('div' ).append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:100px; font-size: 12px; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;">Click to Sign</button><br>');
                          }
                          $('.' + result + '' + num + ' div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:100px; font-size: 12px; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;">Click to Sign</button><br>');
      
                        //  console.log('-->.' + result + '' + num);
                          const x = $('.' + result + '' + num).position();
                          if (number < numItems) {
                            $('html, body').animate({
                              scrollTop: ($('.' + result + '' + num).offset().top + x.top - 100)
                            }, 500);
                          }
      
                          // let next;
                          // next = $(this).nextAll('.' + result).next();
                          // alert(next);
                          // $('html,body').scrollTop(next);
                          // const date = Date.now();
                          // console.log(this.datePipe.transform(date, 'yyyy-MM-dd'));
                          const now = new Date();
                          const year = '' + now.getFullYear();
                          let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
                          let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
                          let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour; }
                          let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute; }
                          let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second; }
                          const signdate = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
                         // alert($(this).parent())
                        // console.log($(this).prev('div:eq(2)').attr("class"));
                         
                         if($(this).closest('.appended').hasClass('signhere')) {
                           $(this).prev('br').remove();
                           $(this).closest('.appended').addClass('signed');
                          $(this).parent().append(signdate);
                           }
                           if($(this).parent().prev('textarea').hasClass('gettext')) {
                            $(this).parent().prev('textarea').addClass('signed');
                            $(this).parent().prev('textarea').prev('.form-group').css('opacity',0);
                            $(this).parent().prev('textarea').css('border', 'none');

                         // $(this).parent().addClass('ase')
                          }
                          //  alert(JSON.stringify($(this).html()));
                          $(this).closest('.appended').addClass('signed');
                          $(this).closest('.appended').prev('.form-group').css('opacity',0);
                          $(this).remove();
                          
                          // $(this).remove();
                          // alert();
      
                        });
                        // }
                      }, 300);
                    }
                  }
                    // this.gethtml.innerHTML = this.html.data.documenthtml;
                    // this.documenthtml = this.sanitized.bypassSecurityTrustHtml(this.html.data.documenthtml);
                  });
            }
          });
      },
      error => {
        if(error.status == 401) {
          this.router.navigateByUrl('/');
        }
      });
    }
  );

  }

  ngAfterViewInit() {
    // set the initial state of the video
    let video:HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  // loadscript() {
  //   let node = document.createElement('script');
  //       node.src = url;
  //       node.type = 'text/javascript';
  //       node.async = true;
  //       node.charset = 'utf-8';
  //       document.getElementsByTagName('head')[0].appendChild(node);
  // }

downloadpdf() {
  html2canvas(document.body).then(function(canvas) {
    console.log(canvas)
});

//   htmlScreenCaptureJs.capture(
//     htmlScreenCaptureJs.OutputType.STRING,
//     window.document,
//     {
//         'imageFormatForDataUrl': 'image/jpeg',
//         'imageQualityForDataUrl': 1.0
//     }
// );//   var doc = new jsPDF();
//   doc.fromHTML($('body').get(0), 0, 0, {
//     'width': 100, // max width of c
//        // 'elementHandlers': specialElementHandlers
// },function(bla){doc.save('saveInCallback.pdf');},
// );
// // doc.save('sample-file.pdf');
// var doc = new jsPDF('p', 'pt', 'a4', true);
//     doc.fromHTML($('#gethtml').get(0), 0, 0, {
//       'width': 100
//     }, function (dispose) {
//     doc.save('thisMotion.pdf');
//     });

// html2canvas($('#gethtml')[0]).then(canvas => {   
//  // document.body.appendChild(canvas);
//   var a = document.createElement('a');
//   // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
//   a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
//   a.download = 'somefilename.jpg';
//   setTimeout(() => {
//     a.click();

//   }, 4000);
// });
}

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  successCallback(stream: MediaStream) {

    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
   // video.src = window.URL.createObjectURL(stream); ---------  depriciated
    video.srcObject = stream;
    this.toggleControls();
  }

  errorCallback() {
    //handle error here
  }

  processVideo(audioVideoWebMURL) {
    let video: HTMLVideoElement = this.video.nativeElement;
    let recordRTC = this.recordRTC;
    video.src = audioVideoWebMURL;
    this.toggleControls();
    var recordedBlob = recordRTC.getBlob();
    var fileName = 'abc';
                
                var file = new File([recordedBlob], fileName, {
                    type: 'video/webm'
                });
                const formData: FormData = new FormData();
                formData.append('filetoupload', file);
                formData.append('userid',this.usertosign);
                formData.append('docid',this.documentid);
                formData.append('user',this.userid)
                this.http.post('https://mybitrade.com:3001/api/uploadvideofile', formData)
                  .subscribe(data => {
                  });
    recordRTC.getDataURL(function (dataURL) { });
  }
 
  startRecording() {
    let mediaConstraints: any;
     mediaConstraints = {
      video: {
        mandatory: {
          maxWidth: 320,
          maxHeight: 240
        }
      }, audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));


  }

  stopRecording() {
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
  }

  toggleWebcam(): void {
    this.error = null;
    this.camera = true;
    this.imagecaptured = null;
    console.log('im');
    this.showWebcam = !this.showWebcam;
    if (this.webcamImage) {
      this.webcamImage = null;
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
    this.camera = null;
    this.imagecaptured = true;
  }

  handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    // console.log(JSON.stringify(webcamImage));
    this.credentials.image = webcamImage.imageAsDataUrl;
    this.credentials.imag = 'image';
    this.showWebcam = false;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  verifyuser() {

    this.loading = true;
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.useremail = this.details.email;
      this.http.post('https://mybitrade.com:3001/api/email', {
        email: this.useremail,
        image: this.credentials.image
      }).subscribe((res: any) => {
        // tslint:disable-next-line:max-line-length
        this.unknownimage = res.unknownimage;
        const req = this.http.get('https://mybitrade.com:5000/api/recognize?knownfilename=' + res.knownimage + '&unknownfilename=' + res.unknownimage + '.jpg')
          .subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            res => {
              this.faceresponse = res;
              console.log(this.faceresponse);
              if (this.faceresponse.message === 'No Face Found') {
                this.loading = false;
                this.error = 'Your Face Was Not Detected.Please Try Again';
              } else if (this.faceresponse.message === 'Match Not Found') {
                this.loading = false;
                this.error = 'Failed To Recognise You.Please Try Again';
              } else {
                this.initialModal.open();

               // this.startRecording();
           
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line:no-shadowed-variable
                const req = this.http.post('https://mybitrade.com:3001/api/signeduserimage', { userid: this.usertosign, docid: this.documentid, imagename: this.unknownimage }).subscribe(res => {

                });

                this.showpdf = true;
                //  this.router.navigateByUrl('/digital_sign');
                // alert('Verified');
                this.loading = false;
                // this.conveniancecount = 10;
                // setTimeout(function () {
                  setTimeout(() => {
                    $(document).on('blur', '.gettext', function () {
                      $(this).html($(this).val() as any)
                  });
                    var number = 0;
                    this.conveniancecount = 13;
                    const pathname = window.location.pathname; // Returns path only
                    const url = window.location.href;
                    const lastslashindex = url.lastIndexOf('/');
                    this.clas = url.substring(lastslashindex + 1);
                    const result = this.clas;
                    $('div.'+result).show();
                    $('div.appended').not('.'+result).hide();
                    $('.signed').show();
                    $('div.hideme').hide();

                    // var divlength = $('div.appended')
                    // for(var i =0;i< divlength.length;i++) {
                    //   $($(divlength[i]).prev('.form-group').hide());
                    // }
                   // $('div.appended').not('.'+result)
                   // $('.form-group').hide();
                    // if (!$('textarea').hasClass(result)) {
                    //   $('textarea').prop('disabled', true);
                    // }

                    $('textarea').not('.'+result).prop('disabled', true);

                  //  alert(result)
                    const numItems = $('.' + result).length;
                  //  console.log(numItems);
                    // tslint:disable-next-line:max-line-length
                    $('.dell').remove();
                    // $('.gethtml').find('.dell').remove();
                    $('.' + result + '1 div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:100px; font-size: 22px; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;">Click to Sign</button><br>');
                    //  $('.' + result + ' div div').css('pointer-events', 'none');
                    //  $('.' + result + ' div div button').css('cursor', 'pointer');
  
                    // $('.' + result + '1 div div').css('pointer-events', 'none');
                    // alert(this.clas);
                    this.conveniancecount =$('.' + result).length;
  
                    //   alert(this.conveniancecount);
                    // }, 3000);
                    // this.conveniancecount = 56;
                    const y = $('.' + result + '1').position();
                    //alert(y.top)
                    $('html, body').animate({
                      scrollTop: ($('.' + result + '1' ).offset().top + y.top-50)
                    }, 500);
                 //   $('.' + result).click(function () {
                    //   alert(result);
                      // this.conveniancecount=  this.conveniancecount -1;
                      $(document).on('click','.signbutton',function(){
                       // alert('hd')
                        if($(this).parent().prev('textarea').hasClass('gettext')) {
                          $(this).parent().prev('textarea').prev('.form-group').remove();
                       // $(this).parent().addClass('ase')
                        }
                        // if($(this).prev('div').prev('textarea').hasClass('gettext')) {
                        //   //$(this).prev('br').remove();
                        //   alert('maniz')
                        //  $(this).prev('div').remove();
                        //   }
                      number++;
                      // let inc = number + 1;
                      $(this).parent().css({
                        'font-family': 'serif',
                        'text-transform': 'lowercase'
                      });
                      $(this).closest('.' + result).css('border', 'none');
                      // alert($(this).text());
                      const strng = $(this).text();
                      // alert(strng)
                      let res = strng.replace('Click to Sign', '');
                      // alert(res)
                      // tslint:disable-next-line:max-line-length
                      $(this).parent().append('<div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);">' + res + '</div>');
                      // $(this).closest('.removeme').css('display', 'none');
                      //   $('html, body').animate({
                      //     'scrollTop' : $(this).closest('.'+result).position().top;
                      //     alert()
                      // });
                      const num = number + 1;
                      // tslint:disable-next-line:max-line-length
                      if($('.' + result + '' + num).hasClass('gettext')) {
                       // alert('hi')
                        $('.' + result + '' + num).next('div' ).append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:100px; font-size: 12px; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;">Click to Sign</button><br>');
                      }
                      $('.' + result + '' + num + ' div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:100px; font-size: 12px; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;">Click to Sign</button><br>');
  
                    //  console.log('-->.' + result + '' + num);
                      const x = $('.' + result + '' + num).position();
                      if (number < numItems) {
                        $('html, body').animate({
                          scrollTop: ($('.' + result + '' + num).offset().top + x.top - 100)
                        }, 500);
                      }
  
                      // let next;
                      // next = $(this).nextAll('.' + result).next();
                      // alert(next);
                      // $('html,body').scrollTop(next);
                      // const date = Date.now();
                      // console.log(this.datePipe.transform(date, 'yyyy-MM-dd'));
                      const now = new Date();
                      const year = '' + now.getFullYear();
                      let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
                      let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
                      let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour; }
                      let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute; }
                      let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second; }
                      const signdate = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
                     // alert($(this).parent())
                    // console.log($(this).prev('div:eq(2)').attr("class"));
                     
                     if($(this).closest('.appended').hasClass('signhere')) {
                       $(this).closest('.appended').addClass('signed');
                       $(this).prev('br').remove();
                      $(this).parent().append(signdate);
                       }
                       if($(this).parent().prev('textarea').hasClass('gettext')) {
                        $(this).parent().prev('textarea').addClass('signed');
                        $(this).parent().prev('textarea').prev('.form-group').css('opacity',0);
                        $(this).parent().prev('textarea').css('border', 'none');

                     // $(this).parent().addClass('ase')
                      }
                      //  alert(JSON.stringify($(this).html()));
                      $(this).closest('.appended').addClass('signed');
                      $(this).closest('.appended').prev('.form-group').css('opacity',0);
                      $(this).remove();
                      
                      // $(this).remove();
                      // alert();
  
                    });
                    // }
                  }, 300);
                // );
              }
            },
            err => {
              this.loading = false;
              this.error = 'Failed To Recognise You';
              //  alert('Failed To Recognise You');
              console.log('Error occured');
            });
      });
    });
  }

  rejectdocument() {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      const documentid = params['documentid'];
      this.http.post('https://mybitrade.com:3001/api/rejectdoc', {docid: documentid,name:this.username})
        .subscribe(
          data => {
           this.loading = false;
           // alert('document rejected Successfully');
          this.router.navigateByUrl('/rejectedmail');
          this.stopRecording();
          });
    });
  }

  // verifyuser() {
  //   this.loading = false;
  //   // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:max-line-length
  //   $('div.signhere:contains(' + this.username + ') div div').append('<button type="button" class="signbutton" style="background-color: #715632; font-size: 22px; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;">Click to Sign</button>');
  //   $('.signbutton').click(function() {
  //     $(this).parent().css({
  //       'font-family': 'serif',
  //       'text-transform': 'lowercase'
  //     });
  //     $(this).closest('.signhere').css('border', 'none');
  //     // const date = Date.now();
  //     // console.log(this.datePipe.transform(date, 'yyyy-MM-dd'));
  //     const now = new Date();
  //     const year = '' + now.getFullYear();
  //     let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
  //     let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
  //     let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour; }
  //     let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute; }
  //     let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second; }
  //     const signdate = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
  //     $(this).parent().append( '<br>' + signdate);
  //     $(this).closest('.signhere').prev('div').remove();
  //     $(this).remove();
  //   });
  // }

  updatesignature() {

    if(this.withimage === true) {
    this.stopRecording();
    }
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //alert(position)
     //   console.log(position.coords.latitude)
        return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&sensor=true&key="+this.AppComponent.GOOGLE_MAP_KEY)
        .subscribe(data => {
         // console.log(data)
         this.location = data;
         let cityname;
         let statename;
         for (var x = 0, length_1 = this.location.results.length; x < length_1; x++){
           for (var y = 0, length_2 = this.location.results[x].address_components.length; y < length_2; y++){
               var type = this.location.results[x].address_components[y].types[0];
                 if ( type === "administrative_area_level_1") {
                  statename = this.location.results[x].address_components[y].long_name;
                   if (cityname) break;
                 } else if (type === "locality"){
                  cityname = this.location.results[x].address_components[y].long_name;
                   if (statename) break;
                 }
             }
         }
      //   console.log(cityname, statename)
        this.cityname = cityname;
        console.log(this.cityname)
        this.activatedRoute.params.subscribe((params: Params) => {
          const documentid = params['documentid'];
          this.http.post('https://mybitrade.com:3001/api/updatedoc', { html: $('.gethtml').html(), userid: this.userId, docid: documentid, usertosign: this.usertosign,reciptemail: this.useremail,location:this.cityname })
            .subscribe(
              data => {
                this.loading = false;
                alert('document Sent Successfully');
                this.router.navigateByUrl('/landing');
              });
        });
        })

      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }

  }

  applyinitials() {
    this.initialModal.close();
    console.log(this.withimage)
    if(this.withimage === true) {
    this.startRecording();
    const interval = 1000;
    const duration = this.noofpages * 30 * 1000;
    const stream$ = Observable.timer(0, interval)
      .finally(() => 
      {
        this.stopRecording();
        alert('Your Session has expired..Please Start a new Session.');
        this.router.navigateByUrl('/landing');
      })
      .takeUntil(Observable.timer(duration + interval))
      .map(value => duration - value * interval);
    stream$.subscribe(value => this.countDown = value/1000)
    }
  }
}


