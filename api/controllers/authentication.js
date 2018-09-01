var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var buffer = require('buffer');
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');
var base64Img = require('base64-img');
var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function (req, res) {
  // console.log('-------------------------');
  // console.log(req.body);

  // console.log('-------------------------');

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }
  var ts = new Date().getTime();
 
  var user = new User();
  user.name = req.body.fname + " " + req.body.lname;
  user.email = req.body.email;
  user.cpassword = req.body.cpassword;
  user.phonenumber = req.body.phonenumber;
  user.status = 'unverified';
  if (req.body.image == 'none') {
    user.image = 'none';
  }
  else {
    user.image = 'image_' + ts + '.jpg';
  }
  // .create().format('{dd}-{MM}-{yyyy}')
var onlydate =new Date().toUTCString() 
  console.log("onlydate->",onlydate)
  user.setPassword(req.body.password);

  user.save(function (err, profile) {
    if (err) {
      console.log(err);
      res.status(400);
      res.json({
        "err": err
      });
    }
    else {
      
      var dir = path.join(__basedir, '/images/images/') + profile.id;
     
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      
        if (req.body.image != 'none') {
          base64Img.img(req.body.image, dir, 'image_' + ts, function (err, filepath) {
            if (err) {
              console.log(err)
              res.send(err)
            }
            else {
              console.log('with img')
              var token;
              token = user.generateJwt();
              var image=__basedir+'/images/images/'+profile.id+'/'+'image_'+ts;
              res.status(200);
              res.json({
                "token": token,
                "image": image,
                "id": profile.id,
                "imgurl":"https://mybitrade.com:3001/images/" +profile.id+"/image_"+ts+ ".jpg" ,
                  "to": req.body.email,
                  "name":user.name
              });
              // sendmaile(req.body)
    
          //     var toEmailAddress = req.body.email;
          //     var mailAccountUser = 'work.jagveer@gmail.com'
          //     var mailAccountPassword = 'jagveer@123'
          //     var fromEmailAddress = 'work.jagveer@gmail.com'
          //     var transport = nodemailer.createTransport({
          //       service: 'gmail',
          //       auth: {
          //         user: mailAccountUser,
          //         pass: mailAccountPassword
          //       }
          //     })
          //   //  var x ='https://mybitrade.com:3001/images/5ae6a99e1bf48a65c66d0d5e/image_1525066142567.jpg';
          //       var click = "<div><img src='https://mybitrade.com:3001/images/" +profile.id+'/'+'image_'+ts+ ".jpg' style='height:130px'/></div>";
             
          //    // var img= "<div><img src='"+ x +"'/></div>";
    
          //     var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
          //       ' <tbody><tr><td valign="top" align="center">' +
          //       '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">' +
          //       '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
          //       '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
          //       '  <td style="width:50%!important" align="left" valign="middle">' +
          //       click+'</td>' +
          //       '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">' +
          //       '<tbody> <tr><td height="50" style="border:none!important">' +
          //       '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">' +
          //       '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">' +
          //       'This email was sent to you from:<br><br>United States<div>Mobile: <span>7889259983</span> </div>' +
          //       '<div>Email ID:  <span><a href="#" target="_blank">info@gmail.com</a></span>' +
          //       '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>'+
          //     '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
          //       '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
          //       ' <tbody> <tr style="background:#858f03;height:40px">'+
          //     '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Signing Participant Invitation</td>' +
          //       '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
          //       '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>'+onlydate+'</span></span>' +
          //       '</td></tr> </tbody></table></td></tr><tr>' +
          //   '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
          //   '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
          //   '<td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">' +
          //   '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
          //   '<tbody> <tr> <td style="font-family:Myriad Pro;font-size:15px;padding-top:10px"><strong>Dear '+user.name+',</strong></td>' +
          //   ' </tr></tbody> </table></td></tr><tr>' +
          //   '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">' +
          //   'Your have been Registered Successfully.<br> Click the link below to verify and activate your account.<br>' +
          //   '<strong><a href="'+url+'" target="_blank" >Click Here</a></strong> <br>If the link does not work, copy the below url and paste it to the address bar.' +
          //   '</td></tr><tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 0px 4px">EzeeSteve</td>' +
          //   '</tr> <tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px,4px,0px,4px">' +
          //   url +
          //   '</td> This Email was sent to you by:Team, EzeeSteve <br>   Email ID: info@ezeesteve.com</tr></tbody></table>	</td></tr></tbody></table></td> </tr>' +
          //   '<tr><td colspan="2"><img src="images/footerezee.png" style="width:80px;height:auto;float:right;margin:10px">'+
          // '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
          //     var mail = {
          //       from: fromEmailAddress,
          //       to: toEmailAddress,
          //       subject: "EzeeSteve Document Sign ",
          //       html:  template
          //     }
    
          //     transport.sendMail(mail, function (error, response) {
          //       if (error) {
          //         res.json({
          //           success: error,
          //           message: "Something went wrong.Please Try Again"
          //         })
          //       } else {
          //         res.status(200).json({
          //           message: 'Email Sent Successfully'
          //         })
          //       }
    
          //       transport.close();
          //     });
    
    
    
            }
          });
        }
      
        else {
          console.log('else')
          var token;
          token = user.generateJwt();
          var image = "none";
          res.status(200);
          res.json({
            "token": token,
            "image": image,
          
            "id": profile.id,
            "imgurl":"https://mybitrade.com:3001/images/" +profile.id+"/image_"+ts+ ".jpg" ,
              "to": req.body.email,
              "name":user.name

          });
          // sendmaile(req.body)

//           var toEmailAddress = req.body.email;
//           var mailAccountUser = 'work.jagveer@gmail.com'
//           var mailAccountPassword = 'jagveer@123'
//           var fromEmailAddress = 'work.jagveer@gmail.com'
//           var transport = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: mailAccountUser,
//               pass: mailAccountPassword
//             }
//           })
//           if (req.body.image != 'none') {
//             var click = "<div><img src='" + req.body.image + "'/></div>";
//           }
//           else {
//             var click = "<div>Image not avalible</div>";
//           }
// var url ="";
//           var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
//             ' <tbody><tr><td valign="top" align="center">' +
//             '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">' +
//             '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
//             '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
//             '  <td style="width:50%!important" align="left" valign="middle">' +
//             click+'</td>' +
//             '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">' +
//             '<tbody> <tr><td height="50" style="border:none!important">' +
//             '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">' +
//             '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">' +
//             'This email was sent to you from:<br><br>United States<div>Mobile: <span>7889259983</span> </div>' +
//             '<div>Email ID:  <span><a href="#" target="_blank">info@gmail.com</a></span>' +
//             '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>'+
//           '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
//             '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
//             ' <tbody> <tr style="background:#858f03;height:40px">'+
//           '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Signing Participant Invitation</td>' +
//             '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
//             '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>'+onlydate+'</span></span>' +
//             '</td></tr> </tbody></table></td></tr><tr>' +
//             '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
//             '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
//             '<td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">' +
//             '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
//             '<tbody> <tr> <td style="font-family:Myriad Pro;font-size:15px;padding-top:10px"><strong>Dear '+user.name+',</strong></td>' +
//             ' </tr></tbody> </table></td></tr><tr>' +
//             '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">' +
//             'Your have been Registered Successfully.<br> Click the link below to verify and activate your account.<br>' +
//             '<strong><a href="'+url+'" target="_blank" >Click Here</a></strong> <br>If the link does not work, copy the below url and paste it to the address bar.' +
//             '</td></tr><tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 0px 4px">EzeeSteve</td>' +
//             '</tr> <tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px,4px,0px,4px">' +
//             url +
//             '</td> This Email was sent to you by:Team, EzeeSteve <br>   Email ID: info@ezeesteve.com</tr></tbody></table>	</td></tr></tbody></table></td> </tr>' +
//             '<tr><td colspan="2"><img src="images/footerezee.png" style="width:80px;height:auto;float:right;margin:10px">'+
//           '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
//           var mail = {
//             from: fromEmailAddress,
//             to: toEmailAddress,
//             subject: "EzeeSteve Document Sign ",
//             html:  template
//           }

//           transport.sendMail(mail, function (error, response) {
//             if (error) {
//               res.json({
//                 success: error,
//                 message: "Something went wrong.Please Try Again"
//               })
//             } else {
//               res.status(200).json({
//                 message: 'Email Sent Successfully'
//               })
//             }

//             transport.close();
//           });



        }

        // fs.mkdirSync(path.join(__basedir,'/images/images/'+profile.id), 777, function(err,created){
        //     if(err){
        //         console.log(err);
        //         // echo the result back
        //         //response.send("ERROR! Can't make the directory! \n");
        //     }
        //     else {
        //       console.log('reached')
        //       base64Img.img(req.body.image, path.join(__basedir,'/images/images/5ab9e0a4122f0c533011c834/'), 'image_'+ts, function(err, filepath) {
        //           if(err) 
        //           {
        //             console.log(err)
        //             res.send(err)
        //           }
        //         var token;
        //         token = user.generateJwt();
        //         res.status(200);
        //         res.json({
        //           "token" : token
        //         });
        //       });
        //     }
        // });
      } // else 
      // sendmail()

    })


  // })

};

module.exports.login = function (req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function (err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
     // console.log(user.status)
      if(user.status=='verified'){
        token = user.generateJwt();
        res.status(200);
        res.json({
          "token": token
        });
      }
      else{
        res.status(401);
       // err.error.message="unverified"
        res.json({
          error:'unverified'
        });
      }
     
     
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

  // function sendmaile (data){
  //   // Contact.findOne({ _id: doc.usertosign }, 'email', function (err, data) {
  //     // user.name = req.body.fname+" "+req.body.lname;
  //     // user.email = req.body.email;
  //     // user.cpassword = req.body.cpassword;
  //     // user.phonenumber = req.body.phonenumber;
  //     var toEmailAddress = req.body.email;
  //     var mailAccountUser = 'work.jagveer@gmail.com'
  //     var mailAccountPassword = 'jagveer@123'
  //     var fromEmailAddress = 'work.jagveer@gmail.com'
  //     var transport = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         user: mailAccountUser,
  //         pass: mailAccountPassword
  //       }
  //     })
  //     var click= "<div><img src='"+data+"</div>";
  //     var template = '<body><table width="100%" cellpadding="0" cellspacing="0">'+
  //      ' <tbody><tr><td valign="top" align="center">'+
  //             '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">'+
  //  '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">'+
  //                     '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>'+
  //                         '  <td style="width:50%!important" align="left" valign="middle">'+
  //                            '<img src="images/signature.png" style="width:30%"> </td>'+
  //        '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">'+
  //        '<tbody> <tr><td height="50" style="border:none!important">'+
  //         '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">'+
  //          '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">'+
  //         'This email was sent to you from:<br><br>United States<div>Mobile: <span>7889259983</span> </div>'+
  //           '<div>Email ID:  <span><a href="#" target="_blank">info@gmail.com</a></span>'+
  //               '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>'
  //               '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">'+
  //               '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
  //                              ' <tbody> <tr style="background:#858f03;height:40px">'
  //             '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Signing Participant Invitation</td>'+
  //           '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">'+
  //                                     '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>06-06-2018</span></span>'+
  //                                   '</td></tr> </tbody></table></td></tr><tr>'+
  //            '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">'+
  //                               '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>'+
  //                                   '<td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">'+
  //                                     '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
  //    '<tbody> <tr> <td style="font-family:Myriad Pro;font-size:15px;padding-top:10px"><strong>Dear smith will,</strong></td>'+
  //                                      ' </tr></tbody> </table></td></tr><tr>'+
  //      '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">'+
  //   ' This email is an invitation to participate as a signing party in an EzeeSteve E-signature document signing.<br> '+
  //     '<strong><a href="#" target="_blank" >Click Here</a></strong> to view and sign the document in your web browser.'+
  //   '</td></tr><tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 0px 4px">sdfSDF</td>'+
  //   '</tr> <tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px,4px,0px,4px">'+
  //   'After you sign you will receive an email that contains an electronic copy for your records.'+
  //   '</td> </tr></tbody></table>	</td></tr></tbody></table></td> </tr>'+
  //     '<tr><td colspan="2"><img src="images/footerezee.png" style="width:80px;height:auto;float:right;margin:10px">'
  //        '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
  //     var mail = {
  //       from: fromEmailAddress,
  //       to: toEmailAddress,
  //       subject: "EzeeSteve Document Sign ",
  //       html: click + template
  //     }

  //     transport.sendMail(mail, function (error, response) {
  //       if (error) {
  //         res.json({
  //           success: error,
  //           message: "Something went wrong.Please Try Again"
  //         })
  //       } else {
  //         res.status(200).json({
  //           message: 'Email Sent Successfully'
  //         })
  //       }

  //       transport.close();
  //     });
  //   // })

  // }
};