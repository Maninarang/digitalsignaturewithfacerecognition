import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails } from '../authentication.service';
import * as jquery from 'jquery';
import { Router } from '@angular/router';
import 'jqueryui';
//import { constants } from 'fs';
// import { INTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser';
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();
let alreadychecked = false;
let items = [];
let noofusers = [];
let appendedusers= [];
let userid, username, useremail, userinitials, todaydate;
@Component({
  selector: 'pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css'],

})

export class PdfComponent implements OnInit {
  details: UserDetails;
  loading = true;
  pdfimages = [];
  userdata: any;
  userlist: any;
  userdetail: any;
  selected: any;
  // username: string;
  // useremail: string;
  fileslength: any;
  dragged: null;
  today: number = Date.now();
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router,
  ) {


  }

  ngOnInit() {
    // this.selectedusers = 0;

    //  $('.pdfimg').addClass('droppable');
    alreadychecked = false;
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.http.get('https://mybitrade.com:3001/api/userlist/' + this.details._id + '/' + localStorage.getItem('pdfid'))
        .subscribe(data => {
          this.userdata = data;
          this.userlist = this.userdata.data;
          console.log(this.userlist);

        });
    });
    const pdfid = localStorage.getItem('pdfid');
    this.http.post('https://mybitrade.com:3001/api/pdfdetail', { pdfid: pdfid })
      .subscribe(data => {
        // this.pdfimages = data;
        let i: number;
        this.fileslength = data;
        for (i = 0; i < this.fileslength.fileslength; i++) {
          this.pdfimages.push('https://mybitrade.com:3001/uploadedpdf/' + pdfid + '/pdf-' + [i] + '.png');
        }
        // this.adddroppablehandler();
        this.loading = false;
        // setTimeout(() => {
        //   this.adddroppablehandler();
        //   // alert();
        // }, 10000);
      });

  }
  newValue(val) {
    alert(val);
  }
  userselection(uservalue) {
    // alert(uservalue);
    this.http.get('https://mybitrade.com:3001/api/userdetail/' + uservalue)
      .subscribe(data => {
        // console.log(data);
        this.selected = 'show';
        this.userdetail = data;
        useremail = this.userdetail.data.email;
        username = this.userdetail.data.firstName + ' ' + this.userdetail.data.lastName;
        userid = this.userdetail.data._id;
        userinitials = username.match(/\b\w/g) || [];
        userinitials = ((userinitials.shift() || '') + (userinitials.pop() || '')).toUpperCase();
        todaydate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
      if (alreadychecked === false) {
          setTimeout(() => {
            this.adddroppablehandler();
            alreadychecked = true;

            // alert();
          }, 300);
        }
      });
  }

  savehtml() {
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    // this.http.post('https://mybitrade.com:3001/api/savehtml', {html: $('.gethtml').html(), pdfid: localStorage.getItem('pdfid'), userid: this.details._id , docid: localStorage.getItem('docid'), expdate: localStorage.getItem('expdate')})
    // tslint:disable-next-line:max-line-length
    this.http.post('https://mybitrade.com:3001/api/savehtml', { html: $('.gethtml').html(), pdfid: localStorage.getItem('pdfid') })
      .subscribe(data => {
        this.loading = false;
        // alert('Email Sent Successfully');
        this.router.navigateByUrl('/actionrequired');
      });
  }
  senddocument() {
    const totalusers = $(':radio').length;
    // alert(totalusers);
    const apeendedusers = items.length;
    // alert(apeendedusers);
    if (totalusers !== apeendedusers) {
      alert('Place the sign for all participant');
      return false;
    }

    // $('.fixedposition').css('display', 'none');
    const numItems = $('.divsize').length;
    // alert(numItems);
    // return;
    this.loading = true;
    // alert(this.userlist.length);
    // if (this.userlist.length != 2) {
    //   alert('Select Signing Positions for all Participants');
    //   this.loading = false;
    // } else {

    // tslint:disable-next-line:max-line-length
    this.http.post('https://mybitrade.com:3001/api/senddocument', { html: $('.gethtml').html(), pdfid: localStorage.getItem('pdfid'), userid: this.details._id })
      .subscribe(data => {
        this.loading = false;
        alert('Email Sent Successfully');
        this.router.navigateByUrl('/actionrequired');
      });
    // }

  }
  // hideme() {

  //   $('#stickit').css('display', 'none');

  // }
  // showme() {

  //   $('#stickit').css('display', 'block');

  // }




  
  adddroppablehandler() {
    // alert();
    let droppablediv = '';
    let draggablediv = '';
    jquery('.droppable').mouseover(function () {
      // alert(this.id)
      // $(this).css('z-index','0');
      droppablediv = this.id;
    });

    jquery('.draggable').draggable({
      start: function (event, ui) {
        draggablediv = $(this).find('h6').html();
       // console.log(draggablediv);
        //  alert(draggablediv)
      },
      cursorAt: { right: -10 },
      helper: 'clone',
      cursor: 'move',
     // revert: 'invalid',
      scroll: false,
     // snapTolerance: 100
    //  containment: '.inthis'
      //  appendTo: "body",
      // containment: [0,100,10000,10000],
      // opacity: 0.70,
      // zIndex:10000,
      // appendTo: ".pdfimg"
    });
    // alert(count);
    // if (count == null) {
    //   var count = 0;

    // }else {
    //   count = count;
    // }
    // alert(count)


    jquery('.droppable').droppable({
      drop: function (event, ui) {
        // tslint:disable-next-line:no-unused-expression
        // alert($(':radio').length);
        //  for(let i=0;i< $(':radio').length;i++) {
        //   alert($('input[name=r]').val())
        //   // noofusers.push()
        //  }
        // console.log(ui.draggable[0].innerText)
        $(':radio').each(function(){
         // noofusers.push($(this).val())
         // alert($(this).val());
         if((noofusers).includes($(this).val())) {
         }
         else {
           noofusers.push($(this).val())
 
         }
       });

     
        const userid = $('input[name=r]:checked').val();
        // alert($('input[name=r]:checked').val());
        // alert(userid);
        // $('.appended'  ).draggable({ containment: '.gethtml', scroll: false });

        if (!ui.draggable.hasClass('canvas-element')) {
         // console.log('dragged');

          // this.dragged = 'dragged';
          const canvasElement = ui.draggable.clone();
          canvasElement.addClass('canvas-element');
          canvasElement.draggable({
            start: function (event, ui) {
              if($(this).css('right') == '0px' || $(this).css('right') == '45px' ) {
                $(this).css('right','')
              }
            },
            cursor: 'move',
            containment: '.inthis',
         //   cursorAt: { right: -10 },

          });
          $('.inthis').append(canvasElement);
          $('.inthis .form-group').addClass('hideme');
         // $('.canvas-element > div:not(:has(div.appended))').remove();
          setTimeout(() => {
          $('.canvas-element[style*="position: relative"]').remove();
          }, 10);
          $('#finish').show();
          let numItems = $('.' + userid).length;

          numItems++;
          const cls = userid + "" + numItems;

         // alert($('.5b4ef31c73373f5e0ab5c952').length);
         // console.log(cls);
          // tslint:disable-next-line:max-line-length
          if ($.trim(ui.draggable[0].innerText) == 'Initial') {
            canvasElement.append('<div class="dell" style="float: right;margin-top: -24px"><i style="font-size:24px; color:#ff0000;" class="fa">&#xf00d;</i></div></div><div class="removediv appended' + ' ' + userid + ' ' + cls + ' initialsign" style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px; padding: 0 10px;z-index:999"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 19px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">' + userinitials + '</div></div>');
            $('.removediv').prev('div.form-group').remove();
            if((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
          //  alert(appendedusers.length)
          //  alert(noofusers.length)
            if(appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
        //     noofusers.forEach(function(user) {

        //  $('#stickit').css('display', 'block');
        //        });
            // $('.canvas-element .form-group').remove();
          } else if ($.trim(ui.draggable[0].innerText) == 'Name') {
            // tslint:disable-next-line:max-line-length
            canvasElement.append('<div class="dell" style="text-align: right;  position: absolute;top: 0%; right: 0%;" ><i style="font-size:24px; color:#ff0000;" class="fa">&#xf00d;</i></div><div class="removediv appended ' + userid + ' ' + cls + '" style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px; padding: 0 10px"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 19px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">' + username + '</div></div></div>');
            $('.removediv').prev('div.form-group').remove();
            if((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            if(appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
          } else if ($.trim(ui.draggable[0].innerText) == 'Email') {
            // tslint:disable-next-line:max-line-length
            canvasElement.append('<div class="dell" style="text-align: right;  position: absolute;top: 0%; right: 0%;"><i style="font-size:24px; color:#ff0000;" class="fa">&#xf00d;</i></div><div  class="removediv appended ' + userid + ' ' + cls + ' " style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px; padding: 0 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 19px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">' + useremail + '</div></div></div>');
            $('.removediv').prev('div.form-group').remove();
            if((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            if(appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
          } else if ($.trim(ui.draggable[0].innerText) == 'Date') {
            // tslint:disable-next-line:max-line-length
            canvasElement.append('<div class="dell" style="text-align: right;  position: absolute;top: 0%; right: 0%;"><i style="font-size:24px; color:#ff0000;" class="fa">&#xf00d;</i></div><div class="removediv appended ' + userid + ' ' + cls + ' " style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px; padding: 0 10px; "><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 19px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">' + todaydate + ' </div></div></div>');
            $('.removediv').prev('div.form-group').remove();
            if((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            if(appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
          } else if ($.trim(ui.draggable[0].innerText) == 'Signature') {
            // alert('hi')
            // tslint:disable-next-line:max-line-length
            canvasElement.append('<div class="dell" style="text-align: right;  position: absolute;top: 0%; right: 0%;"><i style="font-size:24px; color:#ff0000;" class="fa">&#xf00d;</i></div><div class="signhere appended ' + userid + ' ' + cls + '" style="border: 3px solid black;margin-left: 3px;height: 45px;  padding: 0 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 19px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">' + username + '</div></div></div>');
            if((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
           // console.log(appendedusers)

            if(appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
            // $('.canvas-element .form-group').remove();
          } else if ($.trim(ui.draggable[0].innerText) == 'Text') {
            // tslint:disable-next-line:max-line-length
            canvasElement.append('<div class="dell" style="text-align: right;  position: absolute;top: 0%; right: 0%;"><i style="font-size:24px;color:#ff0000;" class="fa">&#xf00d;</i></div><textarea  rows="1" style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px;  padding: 0 10px;resize:none;background: transparent;" class="gettext appended ' + userid + ' ' + cls + '" ></textarea><div  style="position: absolute;top: 75%; left:5%;"></div>');
            if((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            if(appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
            $(document).on('blur', '.gettext', function () {
              $(this).html($(this).val() as any)
          });
            
            // $('.canvas-element .form-group').remove();
          }
          // canvasElement.css({
          //   left: ((ui.offset.left - $(this).offset().left) + 12),
          //   top: (ui.offset.top - 42),
          //   position: 'absolute'
          // });
         // console.log((ui.offset.left - $(this).offset().left) + 12)
       //  console.log(canvasElement)
     //  console.log(ui.offset.top)
       var topvalue ;
       if(ui.offset.top<20) {
         topvalue = 0
       } else {
         topvalue = (ui.offset.top - 33);
       }
      console.log(((ui.offset.left - $(this).offset().left) + 12))
         if(!$(canvasElement[0].lastChild as any).attr('class')) {

          if(((ui.offset.left - $(this).offset().left) + 12)>750) {
            canvasElement.css({
              //left: ((ui.offset.left - $(this).offset().left) + 12),
              right:0,
              top: topvalue,
              position: 'absolute'
            });
          }
          else if(((ui.offset.left - $(this).offset().left) + 12)>710 && ((ui.offset.left - $(this).offset().left) + 12)<750) {
         //   alert('hi')
              canvasElement.css({
                //left: ((ui.offset.left - $(this).offset().left) + 12),
                //left:690,
                right:0,
                top: topvalue,
                position: 'absolute'
              });
            }
          else if(((ui.offset.left - $(this).offset().left) + 12)<10) {
          //  alert('hi')
            canvasElement.css({
              //left: ((ui.offset.left - $(this).offset().left) + 12),
              left:0,
              top: topvalue,
              position: 'absolute'
            });
          }
          else {
          canvasElement.css({
            left: ((ui.offset.left - $(this).offset().left)),
            top: topvalue,
            position: 'absolute'
          });
        }
         }
         else if($(canvasElement[0].lastChild as any).attr('class').includes('initialsign')) {
          if(((ui.offset.left - $(this).offset().left) + 12)>750) {
            canvasElement.css({
              //left: ((ui.offset.left - $(this).offset().left) + 12),
              right:0,
              top: topvalue,
              position: 'absolute'
            });
          }
          else if(((ui.offset.left - $(this).offset().left) + 12)>710 && ((ui.offset.left - $(this).offset().left) + 12)<750) {
            //  alert('hi')
                canvasElement.css({
                  left: ((ui.offset.left - $(this).offset().left) + 12),
                 // left:690,
                  top: topvalue,
                  position: 'absolute'
                });
              }
          else if(((ui.offset.left - $(this).offset().left) + 12)<10) {
            //  alert('hi')
              canvasElement.css({
                //left: ((ui.offset.left - $(this).offset().left) + 12),
                left:0,
                top: topvalue,
                position: 'absolute'
              });
            }
          else {
          canvasElement.css({
            left: ((ui.offset.left - $(this).offset().left)),
            top: topvalue,
            position: 'absolute'
          });
        } 
         } else {
          if(((ui.offset.left - $(this).offset().left) + 12)>750) {
            canvasElement.css({
              //left: ((ui.offset.left - $(this).offset().left) + 12),
              right:0,
              top: topvalue,
              position: 'absolute'
            });
          }
          else if(((ui.offset.left - $(this).offset().left) + 12)>710 && ((ui.offset.left - $(this).offset().left) + 12)<750) {
          //  alert('hi')
              canvasElement.css({
                //left: ((ui.offset.left - $(this).offset().left) + 12),
                //left:690,
                right:0,
                top: topvalue,
                position: 'absolute'
              });
            }
          else if(((ui.offset.left - $(this).offset().left) + 12)<10) {
            //  alert('hi')
              canvasElement.css({
                //left: ((ui.offset.left - $(this).offset().left) + 12),
                left:0,
                top: topvalue,
                position: 'absolute'
              });
            }
          else {
          canvasElement.css({
            left: ((ui.offset.left - $(this).offset().left)),
            top: topvalue,
            position: 'absolute'
          });
        }
      }
     
          if (items.indexOf(userid) === -1) {
            items.push(userid);
        //    console.log('pushed-->', items);
          } else {
         //   console.log('alrady pushed-->', items);
          }

        }
        // this.dragged = 'dragged';
      //  $('#stickit').css('display', 'block');
      //  $('.gethtml').on('click', '.dell', function () {
        //  alert("hey!");
        $('.dell').click(function() {
        if($(this).next().is('textarea')){
          var classname =  $(this).next('textarea').attr('class').split(' ')[2];
                  }
      //  alert("hey!");
      else {
  var classname =  $(this).next('div').attr('class').split(' ')[2];
      }
  // alert(classname)
   setTimeout(() => {
    var len=$('.'+classname).length;
   // alert(noofusers.length)
   // alert(len)
    if(len == 0) {
      if(appendedusers.indexOf(classname)>-1) {
    appendedusers.splice($.inArray(classname, appendedusers),1);
      }
      }
    //  console.log(appendedusers);

      if(appendedusers.length == noofusers.length) {
        $('#stickit').css('display', 'block');
      }
      else {
        $('#stickit').css('display', 'none');

      }
   }, 10);
   $(this).parent().remove();

    // if(len == 1) {
    // appendedusers.splice($.inArray(classname, appendedusers),1);
    //   }
     // console.log(appendedusers);
      
      //     var classes = $(this).attr('class').split(" ");
      //     // alert(classes[1]);


      //     var numItems = $('.' + classes[1]).length;
      // //    alert(numItems);
      //     // return ;
      //     if ((numItems / 2) == 1) {
      //    //   alert("1");
      //     //   //items.pop(classes[1]);
      //       var index = items.indexOf(classes[1]);
      //       if (index !== -1) items.splice(index, 1)
      //       console.log('Sliced->', items);
           
         
          // } else {
          //  // alert(numItems);
          //   $(this).parent().remove();
          // //   console.log("->", items);
          // }
          // return false;
          
        });
      }
    });
  }

}
