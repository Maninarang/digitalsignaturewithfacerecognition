var cors = require('cors')
var path = require('path');
var express = require('express');
// var multer = require('multer');
var mongoose = require('mongoose');
var csv = require('fast-csv');
var User = mongoose.model('User');
var Document = mongoose.model('Document');
var DocStatus = mongoose.model('DocumentStatus');
var Contact = mongoose.model('Contact');
var SmartMail = mongoose.model('SmartMail');
var FileTransferMail = mongoose.model('FileTransferMail');
var SmartMailContact = mongoose.model('SmartMailContact');
var FileTransferContact = mongoose.model('FileTransferContact');
var formidable = require('formidable');
var fileUpload = require('express-fileupload');
var rimraf = require('rimraf');
var getElement = require('get-element')
var bodyParser = require('body-parser');
var pdftohtml = require('pdftohtmljs');
var htmlToPdf = require('html-to-pdf');
var pdfhtml = require('html-pdf');
var cheerio = require('cheerio');
var conversion = require("phantom-html-to-pdf")();
var base64Img = require('base64-img');
var jsdom = require("jsdom");
var wpage = require('webpage'); 
var screenshot = require('url-to-image');
var NodePDF = require('nodepdf');
var webshot = require('webshot');

const { JSDOM } = jsdom

var urlencodedParser = bodyParser.urlencoded({
  extended: true
})
var nodemailer = require('nodemailer');
var inlineBase64 = require('nodemailer-plugin-inline-base64');
var fs = require('fs');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
const requestIp = require('request-ip');
var PDFImage = require("pdf-image").PDFImage;
var createHTML = require('create-html');
let SitePDF = require('site-pdf')


router.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));   // { extended: true} to parse everything.if false it will parse only String
router.use(bodyParser.json({ limit: '50mb' }));
router.use(requestIp.mw())
router.use(cors())
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

router.use(express.static('html/'));
// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/update', update);
router.post('/upload', upload);
router.post('/delete', userdelete);
router.post('/email', useremail);

router.post('/sendmail', sendmail);

function update(req, res) {
  //  console.log(req.body)
  var userid = req.body.user_id;
  var phonenumber = req.body.phonenumber;
  var name = req.body.name;
  var sec_email = req.body.sec_email;


  User.find({ _id: userid }, function (err, result) {
    if (err) {
      res.status('400').json({
        msg: "user not found",
        data: err
      })
    } else {
      // console.log(result);
      var myquery = { _id: userid };
      var newvalues = {
        $set: {
          phonenumber: phonenumber,
          name: name,
          secEmail: sec_email
        }
      };
      User.updateOne(myquery, newvalues, function (err, result) {
        if (err) {
          console.log("failed to updated");
          res.status('400').json({
            msg: "data upadted failed",
            data: err
          })
        } else {
          User.find({ _id: userid }, function (err, result) {
            if (err) {
              res.status('400').json({
                msg: "user not found",
                data: err
              })
            } else {


              console.log("1 document updated");
              res.status('200').json({
                msg: "data upadted sucessfully",
                data: result
              })
            }
          })
        }

      });

    }
    // db.close();
  });

  console.log("req")

}

// ---------------------------------------------------
function userdelete(req, res) {
  userid = req.body.id;
  console.log(userid)
  User.find({ _id: userid }, function (err, result) {
    if (err) {
      console.log('user not found')
      res.status('400').json({
        msg: "user not found",
      })
    }
    else {
      console.log('user found')
      User.remove({ _id: userid }, function (err, result) {
        if (err) {
          console.log('user deleted not found')
          res.status('400').json({
            msg: "failed to delete user",
          })
        }
        else {
          console.log('user deleted')
          res.status('200').json({
            msg: "sucess",
          })
        }
        // }
      })

    }
  })
}
// ======================================================================/
function sendmail(req, res) {
  //console.log("i m in sendmail function", req.body)
  var toEmailAddress = req.body.to;
  var onlydate = new Date().toUTCString()
 // console.log("onlydate->", onlydate)

  var mailAccountUser = 'signup.ezeesteve@gmail.com'
  var mailAccountPassword = 'steve@098'
  var fromEmailAddress = 'signup.ezeesteve@gmail.com' 
  var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailAccountUser,
      pass: mailAccountPassword
    }
  })
  var uri = req.body.url;
  var lastslashindex = uri.lastIndexOf('/');
  var result = uri.substring(lastslashindex + 1);
  var url = 'https://mybitrade.com/confirm/' + result;
console.log("none or -->",req.body.imageurl);
  //  var x ='https://mybitrade.com:3001/images/5ae6a99e1bf48a65c66d0d5e/image_1525066142567.jpg';
  if (req.body.imageurl == 'none') {
    var click = "<div>Image Not Avalible</div>";

  }
  else {
    var click = "<div><img src='" + req.body.imageurl + "' style='height:130px'/></div>";

  }

  // var img= "<div><img src='"+ x +"'/></div>";

  var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
    ' <tbody><tr><td valign="top" align="center">' +
    '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">' +
    '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
    '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
    '  <td style="width:50%!important" align="left" valign="middle">' +
    click + '</td>' +
    '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">' +
    '<tbody> <tr><td height="50" style="border:none!important">' +
    '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">' +
    '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">' +
    'This email was sent to you from:<br><br>United States<div>Mobile: <span>7889259983</span> </div>' +
    '<div>Email ID:  <span><a href="" target="_blank">info@gmail.com</a></span>' +
    '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>' +
    '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
    '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
    ' <tbody> <tr style="background:#858f03;height:40px">' +
    '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Signing Participant Invitation</td>' +
    '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
    '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>' + onlydate + '</span></span>' +
    '</td></tr> </tbody></table></td></tr><tr>' +
    '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
    '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
    '<td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">' +
    '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
    '<tbody> <tr> <td style="font-family:Myriad Pro;font-size:15px;padding-top:10px"><strong>Dear ' + req.body.name + ',</strong></td>' +
    ' </tr></tbody> </table></td></tr><tr>' +
    '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">' +
    'Your have been Registered Successfully.<br> Click the link below to verify and activate your account.<br>' +
    '<strong><a href="' + url + '" target="_blank" >Click Here</a></strong> <br>If the link does not work, copy the below url and paste it to the address bar.' +
    '</td></tr><tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 0px 4px">EzeeSteve</td>' +
    '</tr> <tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px,4px,0px,4px">' +
    url +
    '</td> This Email was sent to you by:Team, EzeeSteve <br>   Email ID: info@ezeesteve.com</tr></tbody></table>	</td></tr></tbody></table></td> </tr>' +
    '<tr><td colspan="2"><img src="https://mybitrade.com/assets/img/ezee-logo.png" style="width:80px;height:auto;float:right;margin:10px">' +
    '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
  var mail = {
    from: fromEmailAddress,
    to: toEmailAddress,
    subject: "EzeeSteve Email Verification ",
    html: template
  }

  transport.sendMail(mail, function (error, response) {
    if (error) {
      res.json({
        success: error,
        message: "Something went wrong.Please Try Again"
      })
    } else {
      res.status(200).json({
        message: 'Email Sent Successfully'
      })
    }

    transport.close();
  });
}
// =========================================================/
function useremail(req, res) {
  var ts = new Date().getTime();
  email = req.body.email;
  image64 = req.body.image;
  // console.log(userid)
  User.find({ email: email }, function (err, result) {
    if (err) {
     // console.log('user not found')
      res.status('400').json({
        msg: "user not found",
      })
    }
    else {
      var dir = path.join(__basedir, '/images/images/login/') + ts;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        base64Img.img(image64, dir, 'image_' + ts, function (err, filepath) {
          if (err) {
            console.log(err)
            res.send(err)
          }
          var token;
          //token = user.generateJwt();
          var image = __basedir + '/images/images/login/' + ts + '/' + 'image_' + ts;
          res.status(200);
          res.json({
            knownimage: __basedir + '/images/images/' + result[0]._id + "/" + result[0].image,
            unknownimage: image,



          });
        });
      }
    }
  });
}
//  console.log('user found')
//  console.log(result.image)
//  res.status('200').json({
//   image:result[0].image,
// })

//     }
// })
// }
//   User.remove( {"_id": ObjectId("5ae1b6b402b5423c7fbc5db9")});
//   User.find({_id :userid},function(err, result) {
//     if (err) {
//       res.status('400').json({
//         msg:"user not found",
//       data:err
//       })
//     }else{
//       console.log('user found')
//       User.remove({_id :userid}),function(err,res){
//         if(err){
//           res.status('400').json({
//             msg:"user not found",
//           data:err})
//         }
//         else{
//           res.status('200').json({
//             msg:"user deleted",
//           data:""
//           })
//         }
//       }
// }
//   })
// }
// ----------------------------------------------------
function upload(req, res) {
  // console.log("upload")
  // var form = new formidable.IncomingForm();
  //   form.parse(req, function (err, fields, files) {
  var oldpath = files.filetoupload.path;
  var newpath = '../pdf/' + files.filetoupload.name;
  sampleFile = req.files.filetoupload;
  sampleFile.mv('../' + newfilename[0], function (err, suc) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(suc);
    }
  })
  // fs.rename(oldpath, newpath, function (err) {
  //   if (err) {Request header field security-token is not allowed by Access-Control-Allow-Headers in preflight response
  //     throw err;
  //     console.log('im')
  //   }
  //   //res.write('File uploaded and moved!');
  //   //res.end();
  //   else{
  //     console.log('im')

  //     res.status(200).json({
  //       url:'/home/pc/Desktop/jagveer/face-recognition/pdf/' + files.filetoupload.name
  //     })
  //   }

  // });
  //  });
}




router.post("/uploadfile", function (req, res) {
  //global.appRoot = path.resolve(__dirname);
 // console.log(global.appRoot)
  // var str= global.appRoot;
  // var rest = str.substring(0, str.lastIndexOf("/") + 0);
  // var last = rest.substring(0, rest.lastIndexOf("/") + 1);

  var ts = new Date().getTime();
  var dir = path.join(__basedir, '/uploadedpdf/uploadedpdf/') + ts;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var timestamp = new Date().getTime();
      // /home/pc/Desktop/ezeesteve/pdf
      var newpath = path.join(__basedir, '/uploadedpdf/uploadedpdf/') + ts + '/' + 'pdf.pdf';
     // console.log(newpath)
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
          res.status(503).json({
            error: "Something went Wrong.Please Try Agiain.."
          })
        }
        else {
          // res.status(200).json({
          //   // file:"http://127.0.0.1:3000/html/"+new_name+".html"
          //   file:path.join(__basedir,'/uploadedpdf/uploadedpdf/')+ts +'/'+ files.filetoupload.name

          //   })
          
          const pdfImageOpts = {
            // outputDirectory: path.join(__dirname, './wmReports/images'),
            convertExtension: 'png',
            convertOptions: {
              '-colorspace': 'RGB',
              '-interlace': 'none',
              '-density': '300',
              '-quality': '200'
            }
          };
          var pdfImage = new PDFImage(path.join(__basedir, '/uploadedpdf/uploadedpdf/') + ts + '/' + 'pdf.pdf', pdfImageOpts);
          //  var pdfImage = new PDFImage((path.join(__basedir, '/uploadedpdf/uploadedpdf/') + ts + '/' + 'pdf.pdf'), {
          //   convertOptions: {
          //     //  "-resize": "2000x2000",
          //     "-quality": "100"
          //   }
          // });
          pdfImage.convertFile().then(function (imagePaths) {
            res.status(200).json({
              // file:"http://127.0.0.1:3000/html/"+new_name+".html"
              path: '/uploadedpdf/' + ts + '/' + 'pdf.pdf',
              pdfid: ts

            })
          }, function (err) {
            res.status(503).json({
              error: "Something went Wrong.Please Try Agiain.."
            })
          });
        }
      });
    })
  }

})

//-------------------------------------- upload video file ---------------------------------//

router.post("/uploadvideofile", function (req, res) {
  //global.appRoot = path.resolve(__dirname);
 // console.log(global.appRoot)
  // var str= global.appRoot;
  // var rest = str.substring(0, str.lastIndexOf("/") + 0);
  // var last = rest.substring(0, rest.lastIndexOf("/") + 1);

  var ts = new Date().getTime();
  
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var dir = path.join(__basedir, '/uploadedvideos/uploadedvideos/') + fields.userid;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      var oldpath = files.filetoupload.path;
      var timestamp = new Date().getTime();
    
      // /home/pc/Desktop/ezeesteve/pdf
      var newpath = path.join(__basedir, '/uploadedvideos/uploadedvideos/') + fields.userid + '/' + ts+'.webm';
     // console.log(newpath)
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
          res.status(503).json({
            error: "Something went Wrong.Please Try Agiain.."
          })
        }
        else {
        
        Document.updateOne({usertosign:fields.userid,_id:fields.docid},{$set:{uservideo:fields.userid + '/' + ts+'.webm'}},function(err,video) {
          if(err) {
            res.status(400).json({
              message: err
            })
          } else {
            res.status(200).json({
              message: "success"
            })
          }
        })
        }
      });
    })
  

})


// ----------------------------  pdfdetail ------------------------------------------------- //


router.post("/pdfdetail", function (req, res) {
  // console.log(req.body.pdfid)
  const pdfid = req.body.pdfid;
  const dir = path.join(__basedir, '/uploadedpdf/uploadedpdf/') + pdfid;

  fs.readdir(dir, (err, files) => {
    // console.log(files.length);
    res.status(200).json({
      fileslength: files.length - 1,
    })
  });
})

// ----------------------------- get users's list ----------------------- // 


router.get("/userlist/:userId/:docId", function (req, res) {
  var userlist = [];
  var userdata = [];
  var count = 0;
  Document.find({ userid: req.params.userId, documentid: req.params.docId },
    'usertosign', function (err, users) {
      if (err) {
        res.status(400).json({
          data: err
        })
      } else {
       // console.log(users)
        for (let i = 0; i < users.length; i++) {
          userlist.push({ id: users[i].usertosign });
        }
     //   console.log(userlist);
        for (let i = 0; i < userlist.length; i++) {
          Contact.findOne({ _id: userlist[i].id }, 'firstName lastName email', function (err, contact) {
            if (err) {
              res.status(400).json({
                data: err
              })
            } else {

              //  console.log(userlist)
              userdata.push({ _id: contact._id, firstName: contact.firstName, lastName: contact.lastName, email: contact.email })
              count++;
              if (count === userlist.length) {
                res.status(200).json({
                  data: userdata
                })
              }
            }
          })
        }
      }
    })
})

// -------------------------  get user detail ---------------------------- //

router.get("/userdetail/:userid", function (req, res) {
  Contact.findOne({ _id: req.params.userid }, 'firstName lastName email', function (err, user) {
    if (err) {
      res.status(400).json({
        msg: "user not found",
        data: err
      })
    } else {
      res.status(200).json({
        data: user
      });
    }
  })
})

// -------------------------  save html --------------------------------- //

router.post('/savehtml', function (req, res) {
  // var html = createHTML({
  //   body: req.body.html
  // })
  // fs.writeFile(path.join(__basedir,'/uploadedpdf/uploadedpdf/')+req.body.pdfid+'/'+req.body.pdfid+'.html', html, function (err) {
  //   if (err) {
  //     res.status(400).json({
  //       message : err
  //     })
  //   } else {
  // var document = new Document();
  // document.documentid = req.body.pdfid;
  // document.userid = req.body.userid;
  // document.documenthtml = req.body.html;
  // document.actionrequired = 'Pending';
  // document.expiration = req.body.expdate;
  // document.save(function(err,document) {
  //   if(err){
  //     res.status(400).json({
  //       message : err
  //     });
  //   } else {
  //    // console.log(document._id);
  //    Contact.update({docrefId: req.body.docid},{$set:{saveddocId: document._id}},function(err,update) {
  //      if(err) {
  //        res.status(400).json({
  //          message: err
  //        })
  //      } else {

  //       res.status(200).json({
  //                message: 'Success'
  //              })
  //      }
  //    })

  //   }

  // })
  // }
  //   })
  Document.update({ documentid: req.body.pdfid }, { $set: { documenthtml: req.body.html } }, { multi: true }, function (err, update) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      DocStatus.updateOne({ documentid: req.body.pdfid }, { $set: { documentstatus: 'Pending' } }, function (err, updatestatus) {
        if (err) {
          res.status(400).json({
            message: err
          })
        } else {
          res.status(200).json({
            message: 'Success'
          })
        }
      })
    }
  })
})


//---------------------------- send document ------------------------- //


router.post('/senddocument', function (req, res) {

  var uemail, uphonenumber, uimage;
  var counts = 0;
  User.findOne({ _id: req.body.userid }, 'phonenumber email image', function (err, userdetail) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      uemail = userdetail.email;
      uphonenumber = userdetail.phonenumber;
      uimage = userdetail.image;
    }

  })

  Document.update({ documentid: req.body.pdfid }, { $set: { documenthtml: req.body.html } }, { multi: true }, function (err, update) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      Document.find({ documentid: req.body.pdfid, priority: 1 }).count(function (err, count) {
        if(err) {
          res.status(400).json({
            message: err
          }) 
        } else {
          if(count == 1) {
         Document.findOne({ documentid: req.body.pdfid, priority: 1 }, 'usertosign', function (err, doc) {
        if (err) {
          res.status(400).json({
            message: err
          })
        } else {
          DocStatus.updateOne({ documentid: req.body.pdfid }, { $set: { documentstatus: 'Completed' } }, function (err, status) {
            if (err) {
              res.status(400).json({
                message: err
              })
            } else {
              Contact.findOne({ _id: doc.usertosign }, 'email firstName lastName', function (err, data) {
                var toEmailAddress = data.email;

                var mailAccountUser = 'signingrequest.ezeesteve@gmail.com'
                var mailAccountPassword = 'steve@098'
                var fromEmailAddress = 'signingrequest.ezeesteve@gmail.com'
                var transport = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: mailAccountUser,
                    pass: mailAccountPassword
                  }
                })
                if (uimage == 'none') {
                  var click = "<div>Image Not Avalible</div>";

                }
                else {
                  var imageurl = 'https://mybitrade.com:3001/images/' + req.body.userid + '/' + uimage;
                  var click = "<div><img src='" + imageurl + "' style='height:130px'/></div>";

                }
                var url = 'https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/' + doc.usertosign;

                var onlydate = new Date().toUTCString()
                var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
                  ' <tbody><tr><td valign="top" align="center">' +
                  '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">' +
                  '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
                  '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
                  '  <td style="width:50%!important" align="left" valign="middle">' +
                  click + '</td>' +
                  '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">' +
                  '<tbody> <tr><td height="50" style="border:none!important">' +
                  '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">' +
                  '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">' +
                  'This email was sent to you from:<br><br>United States<div>Mobile: <span>' + uphonenumber + '</span> </div>' +
                  '<div>Email ID:  <span><a>' + uemail + '</a></span>' +
                  '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>' +
                  '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
                  '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                  ' <tbody> <tr style="background:#858f03;height:40px">' +
                  '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Signing Participant Invitation</td>' +
                  '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
                  '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>' + onlydate + '</span></span>' +
                  '</td></tr> </tbody></table></td></tr><tr>' +
                  '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
                  '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
                  '<td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">' +
                  '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                  '<tbody> <tr> <td style="font-family:Myriad Pro;font-size:15px;padding-top:10px"><strong>Dear ' + data.firstName + ' ' + data.lastName + ',</strong></td>' +
                  ' </tr></tbody> </table></td></tr><tr>' +
                  '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">' +
                  'This email is an invitation to participate as a signing party in an EzeeSteve E-signature document si.gning<br>' +
                  '<strong><a href="' + url + '" target="_blank" >Click Here</a></strong>to view and sign the document in your web browser.' +
                  '</td></tr><tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 0px 4px">After you sign you will receive an email that contains an electronic copy for your records.</td>' +
                  '</tr> </tbody></table>	</td></tr></tbody></table></td> </tr>' +
                  '<tr><td colspan="2"><img src="https://mybitrade.com/assets/img/ezee-logo.png" style="width:80px;height:auto;float:right;margin:10px">' +
                  '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
                var mail = {
                  from: fromEmailAddress,
                  to: toEmailAddress,
                  subject: "EzeeSteve Document Sign ",
                  html: template
                }

                transport.sendMail(mail, function (error, response) {
                  if (error) {
                    res.json({
                      success: error,
                      message: "Something went wrong.Please Try Again"
                    })
                  } else {
                    res.status(200).json({
                      message: 'Email Sent Successfully'
                    })
                  }

                  transport.close();
                });
              })
            }
          })
        }
      })
    } else {
      Document.find({ documentid: req.body.pdfid}, 'usertosign', function (err, doc) {
        if (err) {
          res.status(400).json({
            message: err
          })
        } else {
          DocStatus.updateOne({ documentid: req.body.pdfid }, { $set: { documentstatus: 'Completed' } }, function (err, status) {
            if (err) {
              res.status(400).json({
                message: err
              })
            } else {
              for (let i=0;i<doc.length; i++) {
              Contact.findOne({ _id: doc[i].usertosign }, 'email firstName lastName', function (err, data) {
                var toEmailAddress = data.email;

                var mailAccountUser = 'signingrequest.ezeesteve@gmail.com'
                var mailAccountPassword = 'steve@098'
                var fromEmailAddress = 'signingrequest.ezeesteve@gmail.com'
                var transport = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: mailAccountUser,
                    pass: mailAccountPassword
                  }
                })
                if (uimage == 'none') {
                  var click = "<div>Image Not Avalible</div>";

                }
                else {
                  var imageurl = 'https://mybitrade.com:3001/images/' + req.body.userid + '/' + uimage;
                  var click = "<div><img src='" + imageurl + "' style='height:130px'/></div>";

                }
                var url = 'https://mybitrade.com/newsign/' + doc[i]._id + '/' + req.body.userid + '/' + doc[i].usertosign;

                var onlydate = new Date().toUTCString()
                var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
                  ' <tbody><tr><td valign="top" align="center">' +
                  '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">' +
                  '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
                  '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
                  '  <td style="width:50%!important" align="left" valign="middle">' +
                  click + '</td>' +
                  '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">' +
                  '<tbody> <tr><td height="50" style="border:none!important">' +
                  '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">' +
                  '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">' +
                  'This email was sent to you from:<br><br>United States<div>Mobile: <span>' + uphonenumber + '</span> </div>' +
                  '<div>Email ID:  <span><a>' + uemail + '</a></span>' +
                  '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>' +
                  '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
                  '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                  ' <tbody> <tr style="background:#858f03;height:40px">' +
                  '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Signing Participant Invitation</td>' +
                  '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
                  '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>' + onlydate + '</span></span>' +
                  '</td></tr> </tbody></table></td></tr><tr>' +
                  '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
                  '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
                  '<td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">' +
                  '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                  '<tbody> <tr> <td style="font-family:Myriad Pro;font-size:15px;padding-top:10px"><strong>Dear ' + data.firstName + ' ' + data.lastName + ',</strong></td>' +
                  ' </tr></tbody> </table></td></tr><tr>' +
                  '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">' +
                  'This email is an invitation to participate as a signing party in an EzeeSteve E-signature document si.gning<br>' +
                  '<strong><a href="' + url + '" target="_blank" >Click Here</a></strong>to view and sign the document in your web browser.' +
                  '</td></tr><tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 0px 4px">After you sign you will receive an email that contains an electronic copy for your records.</td>' +
                  '</tr> </tbody></table>	</td></tr></tbody></table></td> </tr>' +
                  '<tr><td colspan="2"><img src="https://mybitrade.com/assets/img/ezee-logo.png" style="width:80px;height:auto;float:right;margin:10px">' +
                  '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
                var mail = {
                  from: fromEmailAddress,
                  to: toEmailAddress,
                  subject: "EzeeSteve Document Sign ",
                  html: template
                }

                transport.sendMail(mail, function (error, response) {
                  if (error) {
                    res.json({
                      success: error,
                      message: "Something went wrong.Please Try Again"
                    })
                  } else {
                    counts++;
                    if(counts == doc.length) {
                    res.status(200).json({
                      message: 'Email Sent Successfully'
                    })
                  }
                  else {
                    console.log(counts)
                    console.log(doc.length);
                  }
                }
                  transport.close();
                });
              })
            }
          }
          })
        }
      })
    }
    }
    })
    }
  })
})




// --------------------------- get document -------------------------//\

router.get('/getdocument/:userid/:documentid', function (req, res) {

  Document.findOne({ _id: req.params.documentid }, 'documenthtml withimage documentstatus documentid', function (err, dochtml) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      res.status(200).json({
        data: dochtml
      })
    }

  })
})

// --------------------------  reject document -------------------------- //
router.post('/rejectdoc', function (req, res) {

  Document.updateOne({ _id: req.body.docid}, { $set: { documentstatus: 'Rejected'} }, function (err, status) {
    if (err) {
      res.status(400).json({
        message: err,
      })
    } else {
   Document.findOne({_id:req.body.docid},'userid',function(err,user) {
    if (err) {
      res.status(400).json({
        message: err,
      })
    } else { 
    //  console.log(user._id)
   User.findOne({_id:user.userid},'email',function(err,email){
    var mailAccountUser = 'signingrequest.ezeesteve@gmail.com'
    var mailAccountPassword = 'steve@098'
    var fromEmailAddress = 'signingrequest.ezeesteve@gmail.com'
    var transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailAccountUser,
        pass: mailAccountPassword
      }
    })
    var onlydate = new Date().toUTCString();
  
    var image = 'https://mybitrade.com/assets/img/signature.png';
    var click = "<div><img src='" + image + "' style='height:130px'/></div>";
  
    //   var click= '<p>Click <a href="https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/'+user.usertosign+'">here</a></p>';
    var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
      ' <tbody><tr><td valign="top" align="center">' +
      '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">' +
      '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
      '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
      '  <td style="width:50%!important" align="left" valign="middle">' + click +
      '</td>' +
      '</tr>' +
      '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
      '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
      ' <tbody> <tr style="background:#858f03;height:40px">' +
      '<td style="width:60%!important;font-size:14px;padding-left:10px;color:#fff" colspan="2" valign="middle">Signing Participant Rejected Document</td>' +
      '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
      '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>' + onlydate + '</span></span>' +
      '</td></tr> </tbody></table></td></tr><tr>' +
      '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
      '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
      '<td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">' +
      '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
      '<tbody> <tr> <td style="font-family:Myriad Pro;font-size:15px;padding-top:10px"><strong>Hello</td>' +
      ' </tr></tbody> </table></td></tr><tr>' +
      '<td colspan="6">' +
      req.body.name + ' has rejected siging document. You can send again or contact this person .<br>' +
      '</td></tr><tr>'+
      '</tr> </tbody></table>	</td></tr></tbody></table></td> </tr>' + '<tr><td colspan="2"><img src="https://mybitrade.com/assets/img/ezee-logo.png" style="width:80px;height:auto;float:right;margin:10px">' +
      '</td></tr>' +
      '</tbody> </table></td> </tr> </tbody> </table> </body>';
      var mail = {
        from: fromEmailAddress,
        to: email.email,
        subject: "Document Reject",
        html: template
      }
  
      transport.sendMail(mail, function (error, response) {
        if (error) {
          res.json({
            success: error,
            message: "Something went wrong.Please Try Again"
          })
        } else {
          res.status(200).json({
            message: 'Success'
          })
        }
  
        transport.close();
      });
   })
    }
    }) 
  
     
    }
  })
  })

// ----------------------- get document count ------------------------- //

router.get('/documentcount/:userid', function (req, res) {

  Document.find({ userid: req.params.userid }).count(function (err, count) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      var documentcount = count + "";
      while (documentcount.length < 8) documentcount = "0" + documentcount;
      res.status(200).json({
        data: documentcount
      })
    }

  })

})

// ----------------------- check user is eligible to open doc or not ------------------------- //

router.get('/checkeligibility/:useremail/:docid/:userid', function (req, res) {

  Contact.findOne({ userId: req.params.userid, email: req.params.useremail }, function (err, user) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      if (!user) {
        res.status(400).json({
          data: 0                  // 0 - user is  not eligible
        })


      } else {
        Document.find({ usertosign: user._id, _id: req.params.docid }).count(function (err, count) {
          if (err) {
            res.status(400).json({
              message: err
            })
          } else {
            if (count > 0) {
              res.status(200).json({
                data: 1                   // 1 - user is eligible
              })
            } else {
              res.status(200).json({
                data: 0                   // 0 - user is  not eligible
              })
            }
          }

        })
      }
    }
  })


})

//--------------------------- add new participant --------------------- //

router.post('/addnewparticipant', function (req, res) {
  const contact = new Contact();
  contact.userId = req.body.userId;
  contact.firstName = req.body.firstName;
  contact.lastName = req.body.lastName;
  contact.email = req.body.email;
  contact.address = req.body.address;
  contact.subject = req.body.subject;
  contact.message = req.body.message;
  // contact.docrefId = req.body.docId;
  // contact.priority = req.body.priority;
  // contact.type = req.body.type;
  Contact.findOne({ email: req.body.email, userId: req.body.userId }).count(function (err, count) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      if (count > 0) {
        Contact.findOne({ email: req.body.email, userId: req.body.userId }, function (err, user) {
          if (user) {
            res.status(200).json({
              message: 2,
              id: user._id                  // 2 = user already in your contact list
            })
          }
          else {
            res.status(400).json({
              message: err
            });
          }

        });

      } else {
        contact.save(function (err, contact) {
          if (err) {
            res.status(400).json({
              message: err
            });
          } else {
            res.status(200).json({
              id: contact._id,
              message: 1               // 1 = contact created successfully
            })
          }
        })
      }
    }
  })
})


// ------------------------------ get user contacts ----------------------//

router.get('/mycontacts/:userid', function (req, res) {
  Contact.find({ userId: req.params.userid }, 'email firstName lastName', function (err, contacts) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      res.status(200).json({
        data: contacts
      })
    }
  })
})

//------------------------------ get user contact detail ------------------ //

router.get('/contactdetail/:id', function (req, res) {
  Contact.find({ _id: req.params.id }, 'email firstName lastName type', function (err, contactdetail) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      res.status(200).json({
        data: contactdetail
      })
    }
  })
})

// ------------------------ add users to document ----------------------------------------//

router.post('/addusertodocument', function (req, res) {
  // var usertosign  = 
  //console.log(req.body.usertosign.length)
  var success = [];
  var count = 0;
  var docstatus = new DocStatus();
  docstatus.documentid = req.body.pdfid;
  docstatus.userid = req.body.userid;
  docstatus.save(function (err, status) {
    if (err) {
      res.status(400).json({
        message: err
      });
    } else {
      for (let i = 0; i < req.body.usertosign.length; i++) {
        //console.log(req.body.usertosign[i].id)
        var document = new Document();
        document.documentid = req.body.pdfid;
        document.userid = req.body.userid;
        document.sendername = req.body.sendername;
        document.usertosign = req.body.usertosign[i].id;
        document.withimage = req.body.withimage;
        if(req.body.priority === true) {
        document.priority = i + 1;
        } else {
          document.priority = 1;
        }
        document.actionrequired = 'Not Signed';
        document.expiration = req.body.expdate;
        document.save(function (err, document) {
          if (err) {
            res.status(400).json({
              message: err
            });
          } else {
            success.push('success');
            count++;
            if (count === req.body.usertosign.length) {
              res.status(200).json({
                message: 'success'
              });
            }
          }
        })
      }
    }
  })
})



router.post('/updatedoc', function (req, res) {
  //console.log(req.body.reciptemail)
  var uemail, uphonenumber, uimage;
  const ip = req.clientIp;
 // console.log(ip);
 
 console.log(req.body.userid)
  // var res = str.replace("::ffff:", "");
  // var ip="res";
  // console.log(ip);
  User.findOne({ _id: req.body.userid }, 'phonenumber email image', function (err, userdetail) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      uemail = userdetail.email;
      uphonenumber = userdetail.phonenumber;
      uimage = userdetail.image;
    }

  })
  Document.findOne({ _id: req.body.docid }, 'documentid', function (err, doc) {
    if (err) {
      res.status(400).json({
        message: err,
        error: "here5"
      })
    } else {
      var did=doc.documentid;
      console.log(req.body.docid,req.body.userid,req.body.usertosign)
      Document.updateOne({ _id: req.body.docid,usertosign:req.body.usertosign }, { $set: { actionrequired: 'Signed',location:req.body.location,ip:ip,signedTime: Date()  } }, function (err, status) {
        if (err) {
          res.status(400).json({
            message: err,
            error: "here4"
          })
        } else {
          Document.update({ documentid: doc.documentid }, { $set: { documenthtml: req.body.html} }, { multi: true }, function (err, update) {
            if (err) {
              res.status(400).json({
                message: err,
                error: "here3"
              })
            } else {
              Document.findOne({ documentid: doc.documentid, user: { $ne: req.body.userid }, actionrequired: 'Not Signed' }, 'usertosign', function (err, user) {
                if (err) {
                  res.status(400).json({
                    message: err,
                    error: "here2"
                  })
                } else {
                  if (!user) {
                    // res.status(200).json({
                    //   message: 'success'
                    // })
                    console.log('end')
                    var uemail = uemail;
                    console.log(uemail);
                    var mailAccountUser = 'signingreceipt..ezeesteve@gmail.com'
                    var mailAccountPassword = 'steve@098'
                    var fromEmailAddress = 'signingreceipt..ezeesteve@gmail.com'
                    var transport = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: mailAccountUser,
                        pass: mailAccountPassword
                      }
                    })

                    if (uimage == 'none') {
                      var click = "<div>Image Not Avalible</div>";

                    }
                    else {
                      var imageurl = 'https://mybitrade.com:3001/images/' + req.body.userid + '/' + uimage;
                      var click = "<div><img src='" + imageurl + "' style='height:130px'/></div>";

                    }
                    var url = 'https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/' + req.body.usertosign;

                    var onlydate = new Date().toUTCString()
                    //   var click= '<p>Click <a href="https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/'+user.usertosign+'">here</a></p>';
                    var template = '<body><table width="100%" cellpadding="0" cellspacing="0">'+
                    '<tbody><tr><td valign="top" class="m_7195789729905264023heading" align="center">'+
                  ' <table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">'+
                   '<tbody><tr><td valign="top" class="m_7195789729905264023heading">'+
                   '<table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">'+
                   '<tbody> <tr><td height="3" colspan="2"></td></tr>'+
                   '<tr><td style="width:50%!important" align="left" valign="middle">'+
                   '<img src="http://www.ezeesteve.com/images/signature.png"style="width:30%" class="CToWUd">'+
                   '</td><td align="right" valign="top">'+
                    '<table border="0" width="100%" align="left" cellspacing="2" height="120">'+
                     '<tbody><tr><td height="50" style="border:none!important"></td>'+
                     '</tr></tbody></table> </td></tr></tbody></table></td></tr> <tr>'+
                    '<td colspan="2"><table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">'+
                
                   '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                   '<tbody><tr style="background:#858f03;height:40px"><td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Sender Signature Receipt</td>'+
                  '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">'+
                  '<strong>Date: </strong>&nbsp;<span class="aBn" data-term="goog_305617764"tabindex="0">'+
                    '<span class="aQJ">'+onlydate+'</span></span></td></tr></tbody> </table></td></tr><tr>'+
                   ' <td valign="top" colspan="2" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">'+
                  '<table width="99%" border="0" cellspacing="0" cellpadding="0">'+
                   '<tbody><tr> <td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">'+
                    '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr>'+
                    '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;text-align:justify" colspan="3">This receipt contains verifiable proof of your'+
                    'EzeeSteve transaction. The holder of thisreceipt has proof of delivery, message and official time of signature.</td>'+
                    '</tr>  <tr><td colspan="3"><strong>Message Statistics</strong> </td></tr><tr>'+
                    '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px;width:30%">'+
                    ' <strong>Email ID</strong> </td><td style="width:5%">&nbsp;</td>'+
                    '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                    '<a href="mailto:'+uemail+'"target="_blank">'+uemail+'</a> </td>'+
                    '</tr>  <tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                    '<strong>File Name</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+did+'.pdf</td>'+
                   '</tr><tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                    '<strong>Signed By</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                   '<a href="mailto:'+req.body.reciptemail+'"target="_blank">'+req.body.reciptemail+'</a></td></tr><tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                   '<strong>Signed Date</strong> </td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+onlydate+'</td>'+
                   '</tr> <tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                   '<strong>IP</strong></td> <td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+ip+'</td>'+
                  '</tr> <tr> <td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                 '<strong>Download</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">Download signed document please'+
                 '</td></tr><tr><td colspan="3">&nbsp;</td></tr></tbody></table></td></tr></tbody></table> </td></tr></tbody></table></td>'+
                '</tr> <tr> </tr> <tr> <td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px"'+
                'colspan="3"><strong>Thanks &amp; Regards</strong></td> </tr><tr>'+
                '<td style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 5px 8px;line-height:24px" colspan="2"><br><div>'+
                '  <strong>Email ID: </strong>'+
                ' <a href="mailto:'+uemail+'" target="_blank">'+uemail+'</a></div></td></tr><tr>'+
                ' <td colspan="2"><img src="http://www.ezeesteve.com/images/ezee.png"style="width:80px;height:25px;float:right;margin:10px" class="CToWUd">'+
                '</td> </tr></tbody></table></td></tr></tbody></table> </body>';
                    var mail = {
                      from: fromEmailAddress,
                      to: uemail,
                      subject: "EzeeSteve Document Sign ",
                      html: template
                    }

                    transport.sendMail(mail, function (error, response) {
                      if (error) {
                        res.json({
                          success: error,
                          message: "Something went wrong.Please Try Again"
                        })
                      } else {
                        res.status(200).json({
                          message: 'Success'
                        })
                      }

                      transport.close();
                    });
                  } else {
                    Contact.findOne({ _id: user.usertosign }, 'email firstName lastName', function (err, contact) {
                      if (err) {
                        res.status(400).json({
                          message: err,
                          error: "here1"
                        })
                      } else {
                    //    console.log(contact.email)
                //    console.log('not end')
                        var toEmailAddress = contact.email;
                        var mailAccountUser = 'signingreceipt.ezeesteve@gmail.com'
                        var mailAccountPassword = 'steve@098'
                        var fromEmailAddress = 'signingreceipt.ezeesteve@gmail.com'
                        var transport = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: mailAccountUser,
                            pass: mailAccountPassword
                          }
                        })

                        if (uimage == 'none') {
                          var click = "<div>Image Not Avalible</div>";

                        }
                        else {
                          var imageurl = 'https://mybitrade.com:3001/images/' + req.body.userid + '/' + uimage;
                          var click = "<div><img src='" + imageurl + "' style='height:130px'/></div>";

                        }
                        var url = 'https://mybitrade.com/newsign/' + user._id + '/' + req.body.userid + '/' + user.usertosign;

                        var onlydate = new Date().toUTCString()
                        //   var click= '<p>Click <a href="https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/'+user.usertosign+'">here</a></p>';
                        var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
                          ' <tbody><tr><td valign="top" align="center">' +
                          '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">' +
                          '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
                          '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
                          '  <td style="width:50%!important" align="left" valign="middle">' +
                          click + '</td>' +
                          '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">' +
                          '<tbody> <tr><td height="50" style="border:none!important">' +
                          '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">' +
                          '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">' +
                          'This email was sent to you from:<br><br>United States<div>Mobile: <span>' + uphonenumber + '</span> </div>' +
                          '<div>Email ID:  <span><a>' + uemail + '</a></span>' +
                          '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>' +
                          '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
                          '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                          ' <tbody> <tr style="background:#858f03;height:40px">' +
                          '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Signing Participant Invitation</td>' +
                          '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
                          '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>' + onlydate + '</span></span>' +
                          '</td></tr> </tbody></table></td></tr><tr>' +
                          '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
                          '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
                          '<td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">' +
                          '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                          '<tbody> <tr> <td style="font-family:Myriad Pro;font-size:15px;padding-top:10px"><strong>Dear ' + contact.firstName + ' ' + contact.lastName + ',</strong></td>' +
                          ' </tr></tbody> </table></td></tr><tr>' +
                          '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">' +
                          'This email is an invitation to participate as a signing party in an EzeeSteve E-signature document si.gning<br>' +
                          '<strong><a href="' + url + '" target="_blank" >Click Here</a></strong>to view and sign the document in your web browser.' +
                          '</td></tr><tr><td colspan="6" style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 0px 4px">After you sign you will receive an email that contains an electronic copy for your records.</td>' +
                          '</tr> </tbody></table>	</td></tr></tbody></table></td> </tr>' +
                          '<tr><td colspan="2"><img src="https://mybitrade.com/assets/img/ezee-logo.png" style="width:80px;height:auto;float:right;margin:10px">' +
                          '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
                        var mail = {
                          from: fromEmailAddress,
                          to: toEmailAddress,
                          subject: "EzeeSteve Document Sign ",
                          html: template
                        }

                        transport.sendMail(mail, function (error, response) {
                          if (error) {
                            res.json({
                              success: error,
                              message: "Something went wrong.Please Try Again"
                            })
                          } else {
                            res.status(200).json({
                              message: 'Success'
                            })
                          }

                          transport.close();
                        });
                        // ================================================
                        // sucess mail userdetail.email
                        // ========================================================
                      //  console.log("here",uemail)
                        
                        var uemail = uemail;
                        var mailAccountUser = 'signingreceipt..ezeesteve@gmail.com'
                        var mailAccountPassword = 'steve@098'
                        var fromEmailAddress = 'signingreceipt..ezeesteve@gmail.com'
                        var transport = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: mailAccountUser,
                            pass: mailAccountPassword
                          }
                        })

                        if (uimage == 'none') {
                          var click = "<div>Image Not Avalible</div>";

                        }
                        else {
                          var imageurl = 'https://mybitrade.com:3001/images/' + req.body.userid + '/' + uimage;
                          var click = "<div><img src='" + imageurl + "' style='height:130px'/></div>";

                        }
                        var url = 'https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/' + user.usertosign;

                        var onlydate = new Date().toUTCString()
                        //   var click= '<p>Click <a href="https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/'+user.usertosign+'">here</a></p>';
                        var template = '<body><table width="100%" cellpadding="0" cellspacing="0">'+
                        '<tbody><tr><td valign="top" class="m_7195789729905264023heading" align="center">'+
                      ' <table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">'+
                       '<tbody><tr><td valign="top" class="m_7195789729905264023heading">'+
                       '<table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">'+
                       '<tbody> <tr><td height="3" colspan="2"></td></tr>'+
                       '<tr><td style="width:50%!important" align="left" valign="middle">'+
                       '<img src="http://www.ezeesteve.com/images/signature.png"style="width:30%" class="CToWUd">'+
                       '</td><td align="right" valign="top">'+
                        '<table border="0" width="100%" align="left" cellspacing="2" height="120">'+
                         '<tbody><tr><td height="50" style="border:none!important"></td>'+
                         '</tr></tbody></table> </td></tr></tbody></table></td></tr> <tr>'+
                        '<td colspan="2"><table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">'+
                    
                       '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                       '<tbody><tr style="background:#858f03;height:40px"><td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Sender Signature Receipt</td>'+
                      '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">'+
                      '<strong>Date: </strong>&nbsp;<span class="aBn" data-term="goog_305617764"tabindex="0">'+
                        '<span class="aQJ">'+onlydate+'</span></span></td></tr></tbody> </table></td></tr><tr>'+
                       ' <td valign="top" colspan="2" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">'+
                      '<table width="99%" border="0" cellspacing="0" cellpadding="0">'+
                       '<tbody><tr> <td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">'+
                        '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr>'+
                        '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;text-align:justify" colspan="3">This receipt contains verifiable proof of your'+
                        'EzeeSteve transaction. The holder of thisreceipt has proof of delivery, message and official time of signature.</td>'+
                        '</tr>  <tr><td colspan="3"><strong>Message Statistics</strong> </td></tr><tr>'+
                        '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px;width:30%">'+
                        ' <strong>Email ID</strong> </td><td style="width:5%">&nbsp;</td>'+
                        '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                        '<a href="mailto:'+uemail+'"target="_blank">'+uemail+'</a> </td>'+
                        '</tr>  <tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                        '<strong>File Name</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+did+'.pdf</td>'+
                       '</tr><tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                        '<strong>Signed By</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                       '<a href="mailto:'+req.body.reciptemail+'"target="_blank">'+req.body.reciptemail+'</a></td></tr><tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                       '<strong>Signed Date</strong> </td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+onlydate+'</td>'+
                       '</tr> <tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                       '<strong>IP</strong></td> <td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+ip+'</td>'+
                      '</tr> <tr> <td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                     '<strong>Download</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">Download signed document please'+
                     '</td></tr><tr><td colspan="3">&nbsp;</td></tr></tbody></table></td></tr></tbody></table> </td></tr></tbody></table></td>'+
                    '</tr> <tr> </tr> <tr> <td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px"'+
                    'colspan="3"><strong>Thanks &amp; Regards</strong></td> </tr><tr>'+
                    '<td style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 5px 8px;line-height:24px" colspan="2">j <br><div>'+
                    '  <strong>Email ID: </strong>'+
                    ' <a href="mailto:'+uemail+'" target="_blank">'+uemail+'</a></div></td></tr><tr>'+
                    ' <td colspan="2"><img src="http://www.ezeesteve.com/images/ezee.png"style="width:80px;height:25px;float:right;margin:10px" class="CToWUd">'+
                    '</td> </tr></tbody></table></td></tr></tbody></table> </body>';
                        var mail = {
                          from: fromEmailAddress,
                          to: uemail,
                          subject: "EzeeSteve Document Sign ",
                          html: template
                        }

                        transport.sendMail(mail, function (error, response) {
                          if (error) {
                            res.json({
                              success: error,
                              message: "Something went wrong.Please Try Again"
                            })
                          } else {
                            res.status(200).json({
                              message: 'Success'
                            })
                          }

                          transport.close();
                        });

                        User.findOne({_id:req.body.userid},function(err,mainuser){
                          if(err) {
                            res.status(400).json({
                              message: err
                            })
                          } else {
                            var toEmailAddress = mainuser.email;
                            var mailAccountUser = 'signingrequest.ezeesteve@gmail.com'
                            var mailAccountPassword = 'steve@098'
                            var fromEmailAddress = 'signingrequest.ezeesteve@gmail.com'
                            var transport = nodemailer.createTransport({
                              service: 'gmail',
                              auth: {
                                user: mailAccountUser,
                                pass: mailAccountPassword
                              }
                            })
                          
                            if (uimage == 'none') {
                              var click = "<div>Image Not Avalible</div>";
                          
                            }
                            else {
                              var imageurl = 'https://mybitrade.com:3001/images/' + req.body.userid + '/' + uimage;
                              var click = "<div><img src='" + imageurl + "' style='height:130px'/></div>";
                          
                            }
                            var url = 'https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/' + user.usertosign;
                          
                            var onlydate = new Date().toUTCString()
                            //   var click= '<p>Click <a href="https://mybitrade.com/newsign/' + doc._id + '/' + req.body.userid + '/'+user.usertosign+'">here</a></p>';
                            var template = '<body><table width="100%" cellpadding="0" cellspacing="0">'+
                            '<tbody><tr><td valign="top" class="m_7195789729905264023heading" align="center">'+
                          ' <table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #858f03">'+
                           '<tbody><tr><td valign="top" class="m_7195789729905264023heading">'+
                           '<table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">'+
                           '<tbody> <tr><td height="3" colspan="2"></td></tr>'+
                           '<tr><td style="width:50%!important" align="left" valign="middle">'+
                           '<img src="http://www.ezeesteve.com/images/signature.png"style="width:30%" class="CToWUd">'+
                           '</td><td align="right" valign="top">'+
                            '<table border="0" width="100%" align="left" cellspacing="2" height="120">'+
                             '<tbody><tr><td height="50" style="border:none!important"></td>'+
                             '</tr></tbody></table> </td></tr></tbody></table></td></tr> <tr>'+
                            '<td colspan="2"><table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">'+
                          
                           '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                           '<tbody><tr style="background:#858f03;height:40px"><td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">Sender Signature Receipt</td>'+
                          '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">'+
                          '<strong>Date: </strong>&nbsp;<span class="aBn" data-term="goog_305617764"tabindex="0">'+
                            '<span class="aQJ">'+onlydate+'</span></span></td></tr></tbody> </table></td></tr><tr>'+
                           ' <td valign="top" colspan="2" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">'+
                          '<table width="99%" border="0" cellspacing="0" cellpadding="0">'+
                           '<tbody><tr> <td valign="top" style="text-align:left;padding-left:4px;padding-right:4px">'+
                            '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr>'+
                            '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;text-align:justify" colspan="3">This receipt contains verifiable proof of your'+
                            'EzeeSteve transaction. The holder of thisreceipt has proof of delivery, message and official time of signature.</td>'+
                            '</tr>  <tr><td colspan="3"><strong>Message Statistics</strong> </td></tr><tr>'+
                            '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px;width:30%">'+
                            ' <strong>Email ID</strong> </td><td style="width:5%">&nbsp;</td>'+
                            '<td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                            '<a href="mailto:'+toEmailAddress+'"target="_blank">'+toEmailAddress+'</a> </td>'+
                            '</tr>  <tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                            '<strong>File Name</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+did+'.pdf</td>'+
                           '</tr><tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                            '<strong>Signed By</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                           '<a href="mailto:'+toEmailAddress+'"target="_blank">'+toEmailAddress+'</a></td></tr><tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                           '<strong>Signed Date</strong> </td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+onlydate+'</td>'+
                           '</tr> <tr><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                           '<strong>IP</strong></td> <td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+ip+'</td>'+
                          '</tr> <tr> <td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">'+
                          '<strong>Download</strong></td><td>&nbsp;</td><td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px">Download signed document please'+
                          '</td></tr><tr><td colspan="3">&nbsp;</td></tr></tbody></table></td></tr></tbody></table> </td></tr></tbody></table></td>'+
                          '</tr> <tr> </tr> <tr> <td style="font-family:Verdana,Arial,Helvetica,sans-serif;font-size:12px;font-weight:inherit;padding-top:5px;margin-left:5px;margin-right:5px"'+
                          'colspan="3"><strong>Thanks &amp; Regards</strong></td> </tr><tr>'+
                          '<td style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 5px 8px;line-height:24px" colspan="2"><br><div>'+
                          '  <strong>Email ID: </strong>'+
                          ' <a href="mailto:'+toEmailAddress+'" target="_blank">'+toEmailAddress+'</a></div></td></tr><tr>'+
                          ' <td colspan="2"><img src="http://www.ezeesteve.com/images/ezee.png"style="width:80px;height:25px;float:right;margin:10px" class="CToWUd">'+
                          '</td> </tr></tbody></table></td></tr></tbody></table> </body>';
                            var mail = {
                              from: fromEmailAddress,
                              to: toEmailAddress,
                              subject: "EzeeSteve Document Sign ",
                              html: template
                            }
                          
                            transport.sendMail(mail, function (error, response) {
                              if (error) {
                                res.json({
                                  success: error,
                                  message: "Something went wrong.Please Try Again"
                                })
                              } else {
                                res.status(200).json({
                                  message: 'Success'
                                })
                              }
                          
                              transport.close();
                            });
                          }
                      
                        })
                        // ------------------------------------------------------------------------------------------------------------
                        // recipt
                        // ----------------------------------------------------------------------------------
                       // console.log("here",req.body.reciptemail)
                        
                     
                      }

                    })


                  }
                }
              })
            }
          })
        }
      })
    }
  })
})
// ===============================================================================================
router.get('/confirmuser/:userid', function (req, res) {
 // console.log(req.params)
  var userid = req.params.userid;
  User.findOneAndUpdate(
    { _id: userid },
    { $set: { status: "verified" } }, function (err, suc) {
      if (err) {
        res.status(400).json({
          message: err,

        })
      }
      else {
       // console.log(suc)
        res.status(200).json({
          message: "verified sucessfully",
          data: suc
        })
      }
    })
})
// =================================================================================================

router.get('/documentdetail/:documentid', function (req, res) {
 // console.log('sad')
  // console.log(req.params.documentid)
  var detailed = [];
  var pdfdata = '';
  var count = 0;
  Document.find({ documentid: req.params.documentid }, function (err, data) {
    if (err) {
      res.status(400).json({
        message: err,
        mssg: "assssqdwe"
      })
    }
    else {
      pdfdata = data;
      var len = data.length;
      for (let i = 0; i < data.length; i++) {
        User.find({ _id: data[i].userid }, function (err, user) {
          if (err) {
            res.status(400).json({
              message: err,
              msg: "df"
            })
          }
          else {
            var userdata = user;

            Contact.find({ _id: pdfdata[i].usertosign }, function (err, result) {
              if (err) {
                res.status(400).json({
                  message: err,
                  msg: "dfsd"
                })
              }
              else {
               // console.log("length-", result.length);
             //   console.log(i)
                for (let j = 0; j < result.length; j++) {
                  detailed.push({
                    userid: result[j]._id,
                    firstName: result[j].firstName,
                    lastName: result[j].lastName,
                    email: result[j].email,
                    documentid: pdfdata[i].documentid,
                    actionrequired: pdfdata[i].actionrequired,
                    expiration: pdfdata[i].expiration,
                    from: userdata[j].email,
                    image: pdfdata[i].userimage,
                    uservideo: pdfdata[i].uservideo

                  })
                }
                count++;
                // data[i].push({userid:result._id,name:result.firstName+" "+result.lastName})
                // if (result != '') {

                //   detailed.push({
                //     userid: result[i]._id,
                //     firstName: result[i].firstName,
                //     lastName: result[i].lastName,
                //     email: result[i].email,
                //     documentid: pdfdata[i].documentid,
                //     actionrequired: pdfdata[i].actionrequired,
                //     expiration: pdfdata[i].expiration,
                //     from: userdata[i].email


                //   })

                //   // console.log("------------------"+ JSON.stringify(detailed) +"-------------------")

                // }
              }
              if (len == count) {
                res.status(200).json({
                  data: detailed
                })
              }
            })

          }
        })
      }
    }
  })
})
// mycompleteddocuments

router.get('/mycompleteddocuments/:userid', function (req, res) {
  var documents = [];
  var count = 0;
  var mydocuments = [];
  var alldocs = [];
  var uni_docs = [];
  var detailed = [];
  var docdata = [];
  var test = [];

  var doc_id = '';
  var newcount = 0;

  Document.find({ userid: req.params.userid, actionrequired: 'Signed' }, 'signedTime documentid userid usertosign ',
    function (err, doc) {
      if (err) {
        res.status(400).json({
          message: err
        })
      } else {
      //  console.log(doc.length);
        //check on time is pending
        alldocs = doc;
        var length = doc.length;
        for (let i = 0; i < doc.length; i++) {

          if (uni_docs.indexOf(doc[i].documentid) == '-1') {
            // console.log('if')
            uni_docs.push(doc[i].documentid);
            docdata.push(doc[i]);

            count++;
          }
          else {
            // console.log('else')
            count++;

          }
          if (count == length) {

         //   console.log(docdata)
            res.status('200').json({
              msg: "Data Loaded Sucessfully",
              data: docdata
            })
          }



        }



      }
    })

})

// ---------------------------------------------------------------------------------------------------

router.get('/mydocuments/:userid', function (req, res) {
  var documents = [];
  var count = 0;
  var mydocuments = [];
  DocStatus.find({ userid: req.params.userid, documentstatus: { $ne: 'Initialize' } }, 'documentid documentstatus', function (err, doc) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      //     console.log(doc[0].documentid)
      //  documents.push({id:doc.documentid});
      //  console.log(documents);
      for (let i = 0; i < doc.length; i++) {
        documents.push({ id: doc[i].documentid, documentstatus: doc[i].documentstatus })
      }
      for (let i = 0; i < documents.length; i++) {
       // console.log(documents.length);
      //  console.log(documents[i].id)
        Document.findOne({ documentid: documents[i].id, actionrequired: 'Not Signed' }, 'dateadded', function (err, docs) {
          if (err) {
            res.status(400).json({
              message: err
            })
          } else {
            if(!docs) {
              count++;
            } else {
          //  console.log(docs)
            var date = docs.dateadded.toDateString().substr(4, 12);
            var time = docs.dateadded.getHours() + ':' + docs.dateadded.getMinutes() + ':' + docs.dateadded.getSeconds();
            var documentstatus = documents[i].documentstatus;
            if (documentstatus == 'Pending') {
              documentstatus = 'Send'
            }
            else {
              documentstatus = 'Sign'
            }
            mydocuments.push({ id: docs._id, documentname: documents[i].id, date: date, time: time, documentstatus: documentstatus });
            count++;
            //  console.log(mydocuments);
            if (count === documents.length) {
              res.status(200).json({
                data: mydocuments
              })
            }
          }
        }
        })
      }
    }
  })

})

//-------------------------------- completed documents by me ------------------------------ //

router.post('/doccompletedbyme',function(req,res) {
let completeddoc = [];
Contact.find({email: req.body.useremail},'firstName',function(err,contact) {
  contact.forEach((doc) => {
   // console.log(doc._id)
  Document.find({usertosign: doc._id,actionrequired:'Signed'},'expiration documentid sendername userimage uservideo expiration signedTime ip location',function(err,document) {
//console.log(document.length);
    if(document.length>0) {
    for(let i=0;i<document.length;i++) {
  // console.log(document)
 // completeddoc.push({id:document[i]._id})
 completeddoc.push(document[i])
 //console.log('sd'+completeddoc.length)
 if(completeddoc.length == document.length) {
  if (err) {
    res.status(400).json({
      message: err
    });
  } else {
    res.status(200).json({
      message: completeddoc
    });
  }
 }
  //console.log(completeddoc)
    }
  } else {
    // res.status(200).json({
    //   message: 'No data'
    // });
  }
  })
  })
})
})


//-------------------------------- pending documents by me ------------------------------ //

router.post('/docpendingbyme',function(req,res) {
  let pendingdoc = [];
  Contact.find({email: req.body.useremail},'firstName',function(err,contact) {
    contact.forEach((doc) => {
    Document.find({usertosign: doc._id,actionrequired:'Not Signed'},'expiration usertosign userid documentid sendername userimage uservideo expiration location',function(err,document) {
      
    if(document.length>0) { 
      for(let i=0;i<document.length;i++) {
    // console.log(document)
   // completeddoc.push({id:document[i]._id})
   pendingdoc.push(document[i])
   if(pendingdoc.length == document.length) {
    if (err) {
      res.status(400).json({
        message: err
      });
    } else {
      res.status(200).json({
        message: pendingdoc
      });
    }
   }
    //console.log(completeddoc)
      }
    } else {
      // res.status(200).json({
      //   message: "no data"
      // });
    }
    })
    })
  })
  })

//-------------------------------- send smartmail ---------------------------------------- //

router.post('/sendsmartmail',function(req,res) {
  var form = new formidable.IncomingForm();
  var ts = new Date().getTime();
  var fieldnames = [];
  var attachmentlist = [];
  var dir = path.join(__basedir, '/mailattachments/mailattachments/') + ts;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    form.parse(req);
    }
 
    form.on('fileBegin', function (name, file){
    //  console.log(dir)
        file.path = dir + '/' + file.name;
        attachmentlist.push({path: file.path})
    });

    form.on('file', function (name, file){
     // file.path = dir + file.name;
      //  console.log('Uploaded ' + file.name);
    });

    form.on('field',function(name,field) {
    //  console.log(name,field)
    fieldnames.push({[name]:field})
    })

    form.on('end',function(name,fields,file) {

    // console.log(fieldnames[from])
    var eachemail = fieldnames[3].toemail.split(',');
         
    for(var i = 0; i < eachemail.length; i++)
     {
      const smartmail = new SmartMail();
      if(fieldnames[4].subject == '')
      {
       subject = 'No subject'
      }
      else {
        subject = fieldnames[4].subject
      }
      if(fieldnames[1].data == 'undefined')
      {
       data = ''
      }
      else {
        data = fieldnames[1].data
      }
    //  console.log(fieldnames[0].fromemail)
      smartmail.userId = fieldnames[0].from;
      smartmail.fromemail = fieldnames[2].fromemail;
      smartmail.toemail = eachemail[i];
      smartmail.subject = subject;
      smartmail.attachment = ts ;
      smartmail.mailcontent = data;
      smartmail.save(function (err, mail) {
        if (err) {
          res.status(400).json({
            message: err
          });
        } else {
          var mailAccountUser = 'signingrequest.ezeesteve@gmail.com'
          var mailAccountPassword = 'steve@098'
          var fromEmailAddress = 'signingrequest.ezeesteve@gmail.com'
          var transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: mailAccountUser,
              pass: mailAccountPassword
            }
          })
          var onlydate = new Date().toUTCString()
          var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
                  ' <tbody><tr><td valign="top" align="center">' +
                  '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #688bfc">' +
                  '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
                  '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
                  '  <td style="width:50%!important" align="left" valign="middle">' +
                  '<img src="https://mybitrade.com/assets/img/smartmail.png" style="width:30%">' + '</td>' +
                  '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">' +
                  '<tbody> <tr><td height="50" style="border:none!important">' +
                  '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">' +
                  '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">' +
                  'This email was sent to you from:<br><br>United States<div>Mobile: <span>' + '1234567890' + '</span> </div>' +
                  '<div>Email ID:  <span><a>' + smartmail.fromemail + '</a></span>' +
                  '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>' +
                  '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
                  '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                  ' <tbody><tr style="background:#688bfc;height:40px">' +
                  '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">EzeeSteve Mail</td>' +
                  '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
                  '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>' + onlydate + '</span></span>' +
                  '</td></tr> </tbody></table></td></tr><tr>' +
                  '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
                  '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
                  '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">' + smartmail.mailcontent +
                  '</td></tr></tbody></table>	</td></tr></tbody></table></td> </tr>' +
                  '<tr><td colspan="2"><hr size="1" color="#CCCCCC"></td></tr>' + 
                  '<tr><td style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 5px 8px;color:#b59848" colspan="2"><strong>This Email was sent to you by:</strong></td></tr>'+
                  '<tr><td style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 5px 8px;line-height:24px" colspan="2">'+
                '<div>Mobile: <span>7889259983</span></div>'+
                '<div>Email ID: <span><a href="#" target="_blank">'+smartmail.fromemail+'</a></span></div></td></tr>'+
                '<tr><td colspan="2"></td></tr><tr><td colspan="2"></td></tr><tr><td colspan="2"></td></tr>'+
                  '<tr><td colspan="2"><img src="https://mybitrade.com/assets/img/footerezee.png" style="width:80px;height:auto;float:right;margin:10px">' +
                  '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
                  var mail = {
                    from: fromEmailAddress,
                    to: smartmail.toemail,
                    subject: 'Smart Mail- '+smartmail.subject,
                    html: template,
                    attachments : attachmentlist
                    // attachments: [
                    //   {   
                    //     path: path.join(__basedir, '/mailattachments/mailattachments/') + ts 
                    //   }
                    // ]
                  }
                 transport.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));
                  transport.sendMail(mail, function (error, response) {
                    if (error) {
                      res.json({
                        success: error,
                        message: "Something went wrong.Please Try Again"
                      })
                    } else {
                      res.status(200).json({
                        message: 'Email Sent Successfully'
                      })
                    }
  
                    transport.close();
                  });
        }
      })
    }
    }) 
})


//-------------------------------- move smartmails to trash ------------------------------- //

router.post('/movesmartmailstotrash', function(req,res) {
  var count = 0;
  for( let i =0;i<req.body.mailid.length;i++) {
    SmartMail.updateOne({ _id: req.body.mailid[i].id }, { $set: { mailtrash: 'Yes' } }, function (err, result) {
      if (err) {
        res.status('400').json({
          message: err
        })
      }
      else {
        count++;
        if(count == req.body.mailid.length) {
        res.status(200).json({
          message: 'Success'
        })
      }
      }
    })
  }
})

//-------------------------------- move smartmails to sent ------------------------------- //

router.post('/movesmartmailstosent', function(req,res) {
  var count = 0;
  for( let i =0;i<req.body.mailid.length;i++) {
    SmartMail.updateOne({ _id: req.body.mailid[i].id }, { $set: { mailtrash: 'No' } }, function (err, result) {
      if (err) {
        res.status('400').json({
          message: err
        })
      }
      else {
        count++;
        if(count == req.body.mailid.length) {
        res.status(200).json({
          message: 'Success'
        })
      }
      }
    })
  }
})


//-------------------------------- delete smartmail  ------------------------------- //

router.post('/deletesmartmail', function(req,res) {
  var count = 0;
  for( let i =0;i<req.body.mailid.length;i++) {
    SmartMail.remove({ _id: req.body.mailid[i].id }, function (err, result) {
      if (err) {
        res.status('400').json({
          message: err
        })
      }
      else {
        count++;
        if(count == req.body.mailid.length) {
        res.status(200).json({
          message: 'Success'
        })
      }
      }
    })
  }
})


//-------------------------------- empty smart mail trash  ------------------------------- //

router.post('/emptysmartmailtrash', function(req,res) {
  SmartMail.deleteMany({ userId: req.body.userid, mailtrash: 'Yes'}, function (err, result) {
      if (err) {
        res.status('400').json({
          message: err
        })
      }
      else {
        res.status(200).json({
          message: 'Success'
        })
      
      }
    })

})

//-------------------------------  upload smartmail contacts ------------------------------ //

router.post("/uploadsmartmailcsv", function (req, res) {
 // console.log('hi')
  var ts = new Date().getTime();
  var dir = path.join(__basedir, '/uploadedcsv/uploadedcsv/') + ts;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

      var oldpath = files.filetoupload.path;
      var timestamp = new Date().getTime();
      // /home/pc/Desktop/ezeesteve/pdf
      var newpath = path.join(__basedir, '/uploadedcsv/uploadedcsv/') + ts + '/' + 'csv.csv';
     // console.log(newpath)
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
          res.status(503).json({
            error: "Something went Wrong.Please Try Agiain.."
          })
        }
        else {
    var csvfile = fs.createReadStream(newpath);
   // parser = fastCsv();
//  // console.log(csvfile)
  var contacts = [];
         
  csv
   .fromPath(newpath, {
       headers: true,
       ignoreEmpty: true
   })
   .on("data", function(data){
    // console.log(data['Name'])

       data['_id'] = new mongoose.Types.ObjectId();
       data['userId']= fields.userid;
       data['name'] = data['Name'];
       data['company'] = data['Company Name'];
       data['email'] = data['Email'];
       data['contact'] = data['Contact No'];
       data['mailsent'] = 0;
       contacts.push(data);
   })
   .on("end", function(){
       SmartMailContact.create(contacts, function(err, documents) {
          if (err) {
          res.status('400').json({
            message: err
          });
        } else {
          rimraf(path.join(__basedir, '/uploadedcsv/uploadedcsv/') + ts, function () {});
          res.status(200).json({
            message: 'Success'
          })
        }
       });
   });

  }
  })
  
})
  }
})


//-------------------------------- get smartmail contacts ------------------------------- //

router.post('/getcsvcontacts', function(req,res) {
  SmartMailContact.find({userId:req.body.userid},'name company email contact mailsent',function(err,contact) {
    if(err) {
      res.status(400).json({
        message: err
      })
    } else {
      res.status('200').json({
        data: contact
      })
    }
    }) 
})


//-------------------------------- update smartmail contacts ------------------------------- //

router.post('/updatesmartmailcontact', function(req,res) {
  SmartMailContact.updateOne({ _id: req.body.id}, { $set: { name:req.body.name,contact:req.body.contact,company:req.body.company,email:req.body.email } }, function (err, result) {
    if (err) {
      res.status('400').json({
        message: err
      })
    }
    else {
      res.status(200).json({
        message: 'Success'
      })
    }
  })
})


//-------------------------------- get users smart mail ---------------------------------- //

router.post('/getsmartmail', function(req,res) {

  SmartMail.find({userId:req.body.userid,mailtrash:'No'},'fromemail toemail subject dateadded',function(err,mail) {
  if(err) {
    res.status(400).json({
      message: err
    })
  } else {
    res.status('200').json({
      data: mail
    })
  }
  }) 

})


//-------------------------------- get users trash smart mail ---------------------------------- //

router.post('/gettrashmail', function(req,res) {

  SmartMail.find({userId:req.body.userid,mailtrash:'Yes'},'fromemail toemail subject dateadded',function(err,mail) {
  if(err) {
    res.status(400).json({
      message: err
    })
  } else {
    res.status('200').json({
      data: mail
    })
  }
  }) 

})

//-------------------------------- view smmart mails ------------------------------------- //


router.get('/viewsmartmail/:mailid', function(req,res) {
  var mailcontent = [];
    SmartMail.findOne({ _id: req.params.mailid }, function (err, result) {
      if (err) {
        res.status('400').json({
          message: err
        })
      }
      else {
        // res.status(200).json({
        //   message: result
        // })
        fs.readdir(path.join(__basedir, '/mailattachments/mailattachments/')+result.attachment, (err, files) => {
          files.forEach(file => {
         //   console.log(file.length);
            mailcontent.push({fromemail:result.fromemail,toemail:result.toemail,subject:result.subject,date:result.dateadded,data:result.mailcontent,noofattachments: files.length,attachmentname:file,attachments:result.attachment+'/'+file})

         //   mailcontent.push({attachments:file})   
          });
          if(files.length == 0) {
            mailcontent.push({fromemail:result.fromemail,toemail:result.toemail,subject:result.subject,date:result.dateadded,data:result.mailcontent})
 
          }
          res.status(200).json({
            message: mailcontent
          })
    })
 
  }
})
})
//-------------------------------- delete smart mail contacts  ------------------------------- //

router.post('/deletesmartmailcontact', function(req,res) {
  var count = 0;
  for( let i =0;i<req.body.contactid.length;i++) {
    SmartMailContact.remove({ _id: req.body.contactid[i].id }, function (err, result) {
      if (err) {
        res.status('400').json({
          message: err
        })
      }
      else {
        count++;
        if(count == req.body.contactid.length) {
        res.status(200).json({
          message: 'Success'
        })
      }
      }
    })
  }
})

//-------------------------------- send filetransfer mail ---------------------------------------- //

router.post('/sendfiletransfermail',function(req,res) {
  var form = new formidable.IncomingForm();
  var ts = new Date().getTime();
  var fieldnames = [];
 // var attachmentlist = [];
  var dir = path.join(__basedir, '/assets/'+ts);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    form.parse(req);
    }
 
    form.on('fileBegin', function (name, file){
    //  console.log(dir)
        file.path = dir + '/' + file.name;
     //   attachmentlist.push({path: file.path})
    });

    form.on('file', function (name, file){
     // file.path = dir + file.name;
      //  console.log('Uploaded ' + file.name);
    });

    form.on('field',function(name,field) {
    //  console.log(name,field)
    fieldnames.push({[name]:field})
    })

    form.on('end',function(name,fields,file) {

    // console.log(fieldnames[from])
    var eachemail = fieldnames[3].toemail.split(',');
         
    for(var i = 0; i < eachemail.length; i++)
     {
   //   const smartmail = new SmartMail();
      if(fieldnames[4].subject == '')
      {
       subject = 'No subject'
      }
      else {
        subject = fieldnames[4].subject
      }
      if(fieldnames[1].data == 'undefined')
      {
       data = ''
      }
      else {
        data = fieldnames[1].data
      }
    //  console.log(fieldnames[0].fromemail)
      // smartmail.userId = fieldnames[0].from;
      // smartmail.fromemail = fieldnames[2].fromemail;
      // smartmail.toemail = eachemail[i];
      // smartmail.subject = subject;
      // smartmail.attachment = ts ;
      // smartmail.mailcontent = data;
      // smartmail.save(function (err, mail) {

        const filetransfermail = new FileTransferMail();
          filetransfermail.userId = fieldnames[0].from;
          filetransfermail.fromemail = fieldnames[2].fromemail;
          filetransfermail.toemail = eachemail[i];
          filetransfermail.subject = subject;
          filetransfermail.attachment = ts 
          filetransfermail.mailcontent = data;
          filetransfermail.password = fieldnames[5].password;
          filetransfermail.save(function (err, mail) {

        if (err) {
          res.status(400).json({
            message: err
          });
        } else {
          var mailAccountUser = 'signingrequest.ezeesteve@gmail.com'
          var mailAccountPassword = 'steve@098'
          var fromEmailAddress = 'signingrequest.ezeesteve@gmail.com'
          var transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: mailAccountUser,
              pass: mailAccountPassword
            }
          })
          var url="https://mybitrade.com/filepassword/"+mail._id;
          var onlydate = new Date().toUTCString()
          var template = '<body><table width="100%" cellpadding="0" cellspacing="0">' +
          ' <tbody><tr><td valign="top" align="center">' +
          '<table width="90%" border="0" style="font-family:Myriad Pro;border:30px solid #688bfc">' +
          '<tbody> <tr><td valign="top"><table width="100%" height="40" border="0" cellpadding="0" cellspacing="0">' +
          '  <tbody>  <tr><td height="3" colspan="2"></td> </tr><tr>' +
          '  <td style="width:50%!important" align="left" valign="middle">' +
          '<img src="https://mybitrade.com/assets/img/smartmail.png" style="width:30%">' + '</td>' +
          '<td align="right" valign="top"><table border="0" width="100%" align="left" cellspacing="2" height="120">' +
          '<tbody> <tr><td height="50" style="border:none!important">' +
          '<div style="border:10px solid #b59848;width:295px;height:170px;float:right;margin:1.5% 3% 1% 0%">' +
          '<div style="width:280px;height:145px;border:2px solid #b59848;margin:auto;margin-top:1%;font-family:Verdana,Geneva,sans-serif;font-size:14px;padding:15px 0px 0px 5px">' +
          'This email was sent to you from:<br><br>United States<div>Mobile: <span>' + '1234567890' + '</span> </div>' +
          '<div>Email ID:  <span><a>' + filetransfermail.fromemail + '</a></span>' +
          '</div></div> </div>  </td></tr></tbody></table></td> </tr></tbody> </table> </td> </tr>' +
          '<tr> <td colspan="2"> <table width="100%" cellpadding="2" cellspacing="2" border="0" style="background:#f1f1f1">' +
          '<tbody><tr><td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
          ' <tbody><tr style="background:#688bfc;height:40px">' +
          '<td style="width:60%!important;font-size:28px;padding-left:10px;color:#fff" colspan="2" valign="middle">EzeeSteve Mail</td>' +
          '<td style="width:40%!important;padding-right:10px;color:#fff" align="right" valign="middle">' +
          '<strong>Date: </strong>&nbsp;<span tabindex="0"><span>' + onlydate + '</span></span>' +
          '</td></tr> </tbody></table></td></tr><tr>' +
          '<td valign="top" colspan="6" align="center" style="font-family:Myriad Pro;font-size:14px;padding:10px 4px 5px 4px;color:#383838;line-height:22px">' +
          '<table width="99%" border="0" cellspacing="0" cellpadding="0"><tbody> <tr>' +
          '<td colspan="6" style="font-family:Myriad Pro;font-size:22px!important;padding:10px 4px 5px 4px">' + filetransfermail.mailcontent +
          '</td></tr></tbody></table>	</td></tr></tbody></table></td> </tr>' +
          '<tr><td colspan="2"><hr size="1" color="#CCCCCC"></td></tr>' + 
          '<tr><td style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 5px 8px;color:#b59848" colspan="2"><strong>This Email was sent to you by:</strong></td></tr>'+
          '<tr><td style="font-family:Myriad Pro;font-size:15px;padding:10px 4px 5px 8px;line-height:24px" colspan="2">'+
        '<div>Mobile: <span>7889259983</span></div>'+
        '<div>Email ID: <span><a href="#" target="_blank">'+filetransfermail.fromemail+'</a></span></div><div>Password: <span><a href="#" target="_blank">'+filetransfermail.password+'</a></span></div><strong><a href="' + url + '" target="_blank" >Click Here</a></strong></td></tr>'+
        '<tr><td colspan="2"></td></tr><tr><td colspan="2"></td></tr><tr><td colspan="2"></td></tr>'+
          '<tr><td colspan="2"><img src="https://mybitrade.com/assets/img/footerezee.png" style="width:80px;height:auto;float:right;margin:10px">' +
          '</td></tr></tbody> </table></td> </tr> </tbody> </table> </body>';
                  var mail = {
                    from: fromEmailAddress,
                    to: filetransfermail.toemail,
                    subject: 'File Transfer Mail- '+filetransfermail.subject,
                    html: template,
                  //  attachments : attachmentlist
                    // attachments: [
                    //   {   
                    //     path: path.join(__basedir, '/mailattachments/mailattachments/') + ts 
                    //   }
                    // ]
                  }
                 transport.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));
                  transport.sendMail(mail, function (error, response) {
                    if (error) {
                      res.json({
                        success: error,
                        message: "Something went wrong.Please Try Again"
                      })
                    } else {
                      res.status(200).json({
                        message: 'Email Sent Successfully'
                      })
                    }
  
                    transport.close();
                  });
        }
      })
    }
    })
})

//-------------------------------- check filetransfer password ---------------------------------------- //

router.post('/checkfiletransferpassword',function(req,res) {

  var mailcontent = [];
  //var viewer;
  FileTransferMail.find({ _id: req.body.id, password: req.body.password },'attachment',function (err, count) {
    if(err) {
      res.status(400).json({
        message: err
      }) 
    } else {
      if(count.length>0) { 
        FileTransferMail.findOne({ _id: req.body.id }, function (err, result) {
          if (err) {
            res.status('400').json({
              message: err
            })
          }
          else {
            // res.status(200).json({
            //   message: result
            // })
            fs.readdir(path.join(__basedir, '/assets/')+result.attachment, (err, files) => {
              files.forEach(file => {
                var stats = fs.statSync(path.join(__basedir, '/assets/')+result.attachment+'/'+file)
               var fileSizeInBytes = stats["size"]
              //Convert the file size to megabytes (optional)
               var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
               var filename = path.join(__basedir, '/assets/')+result.attachment+'/'+file;
               var ext = filename.substring(filename.indexOf('.'));
              
                mailcontent.push({fromemail:result.fromemail,date:result.dateadded,attachmentname:file,filesize:fileSizeInMegabytes,attachments:result.attachment+'/'+file,extension:ext})
      
             //   mailcontent.push({attachments:file})   
              });
              res.status(200).json({
                message: mailcontent
              })
        })
      
      }
      })
        // res.status(200).json({
        //   message: count
        // }) 
      }
      else {
        res.status(200).json({
          message: 'Invalid Password'
        }) 
      }
    }
})
  })

  //-------------------------------- get users filetransfer mail ---------------------------------- //

router.post('/getfiletransfermail', function(req,res) {

  FileTransferMail.find({userId:req.body.userid,mailtrash:'No'},'fromemail toemail subject dateadded',function(err,mail) {
  if(err) {
    res.status(400).json({
      message: err
    })
  } else {
    res.status('200').json({
      data: mail
    })
  }
  }) 

})

//-------------------------------- delete file transfer mail  ------------------------------- //

router.post('/deletefiletransfermail', function(req,res) {
  var count = 0;
  for( let i =0;i<req.body.mailid.length;i++) {
    FileTransferMail.remove({ _id: req.body.mailid[i].id }, function (err, result) {
      if (err) {
        res.status('400').json({
          message: err
        })
      }
      else {
        count++;
        if(count == req.body.mailid.length) {
        res.status(200).json({
          message: 'Success'
        })
      }
      }
    })
  }
})

//-------------------------------- addfiletransfercontact  ------------------------------- //

router.post('/addfiletransfercontact', function(req,res) {
  FileTransferContact.find({email:req.body.email,userId:req.body.userid}).count(function(err,count) {
    if(err){
      res.status(400).json({
        message : err
      });
    }  else {
    if(count>0) {
      res.status(200).json({
        message : 'Email Exists'
      });
    } else {
      if(!req.body.company) {
        company= ''
      }
      else {
        company = req.body.company
      }
      if(!req.body.contact) {
        contact= ''
      }
      else {
        contact = req.body.contact
      }
      const filetransfercontact = new FileTransferContact();
      filetransfercontact.userId = req.body.userid;
      filetransfercontact.name = req.body.name;
      filetransfercontact.email = req.body.email;
      filetransfercontact.contact = contact;
      filetransfercontact.company = company;
      filetransfercontact.save(function(err,contact) {
        if(err){
          res.status(400).json({
            message : err
          });
        } else {
          res.status(200).json({
            message : contact
          });
         }
        })
    }
  }
  })

 
})


//-------------------------------- updatefiletransfercontact ---------------------------- //

router.post('/updatefiletransfercontact',function(req,res) {
  FileTransferContact.updateOne({ _id: req.body.id}, { $set: { name:req.body.name,contact:req.body.contact,company:req.body.company,email:req.body.email } }, function (err, result) {
    if (err) {
      res.status('400').json({
        message: err
      })
    }
    else {
      res.status(200).json({
        message: 'Success'
      })
    }
  })
})

//--------------------------------- updatecontact--------------------------------------- //

router.post('/updatepartcipant',function(req,res) {
  Contact.updateOne({ email: req.body.email, userId: req.body.userid }, { $set: { firstName: req.body.firstName,lastName:req.body.lastName,email:req.body.email,address:req.body.address,subject:req.body.subject,message:req.body.message,type:req.body.type } }, function (err, result) {
    if (err) {
      res.status('400').json({
        message: err
      })
    }
    else {
      res.status(200).json({
        message: 'Success'
      })
    }
    //}
  })

})

router.get('/converthtml',function(req,res){
//var html = `\n                <div _ngcontent-c14="" style="height:100%" class="col-md-8 col-sm-6 col-xs-12 divsize">\n             \n\n                    <div _ngcontent-c14="" class="inthis">\n                        <!--bindings={\n  "ng-reflect-ng-for-of": ""\n}--><div _ngcontent-c14="" class="pdfimg droppable ui-droppable" id="image0">\n\n                            <img _ngcontent-c14="" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534741248953/pdf-0.jpg">\n\n                        </div><div _ngcontent-c14="" class="pdfimg droppable ui-droppable" id="image1">\n\n                            <img _ngcontent-c14="" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534741248953/pdf-1.jpg">\n\n                        </div><div _ngcontent-c14="" class="pdfimg droppable ui-droppable" id="image2">\n\n                            <img _ngcontent-c14="" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534741248953/pdf-2.jpg">\n\n                        </div><div _ngcontent-c14="" class="pdfimg droppable ui-droppable" id="image3">\n\n                            <img _ngcontent-c14=""  src="https://mybitrade.com:3001/uploadedpdf/1534741248953/pdf-3.jpg">\n\n                        </div>\n\n                    <div _ngcontent-c14="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 308.328px; top: 164.297px;">\n                                    <div _ngcontent-c14="" class="form-group hideme">\n                                        <h6 _ngcontent-c14="">Signature</h6>\n                                    </div>\n                                <div class="dell" style="text-align: right;  position: absolute;top: 17%; right: -14%;"><i style="font-size:24px; color:#ff0000;" class="fa"></i></div><div class="signhere appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365421" style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px;  padding: 0 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">Mani Narang</div></div></div></div><div _ngcontent-c14="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 481.328px; top: 296.297px;">\n                                    <div _ngcontent-c14="" class="form-group hideme">\n                                        <h6 _ngcontent-c14="">Signature</h6>\n                                    </div>\n                                <div class="dell" style="text-align: right;  position: absolute;top: 17%; right: -14%;"><i style="font-size:24px; color:#ff0000;" class="fa"></i></div><div class="signhere appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365422" style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px;  padding: 0 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">Mani Narang</div></div></div></div><div _ngcontent-c14="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 177.328px; top: 487.297px;">\n                                    <div _ngcontent-c14="" class="form-group hideme">\n                                        <h6 _ngcontent-c14="">Signature</h6>\n                                    </div>\n                                <div class="dell" style="text-align: right;  position: absolute;top: 17%; right: -14%;"><i style="font-size:24px; color:#ff0000;" class="fa"></i></div><div class="signhere appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365423" style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px;  padding: 0 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">Mani Narang</div></div></div></div></div>\n\n                </div>\n            `
//var html = '\n                <div _ngcontent-c14="" style="height:100%" class="col-md-8 col-sm-6 col-xs-12 divsize">\n             \n\n                    <div _ngcontent-c14="" style="position:relative" class="inthis">\n                        <!--bindings={\n  "ng-reflect-ng-for-of": ""\n}--><div _ngcontent-c14=""  class="pdfimg droppable ui-droppable" id="image0">\n\n                            <img _ngcontent-c14="" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534741248953/pdf-0.jpg">\n\n                        </div><div _ngcontent-c14="" class="pdfimg droppable ui-droppable" id="image1">\n\n                            <img _ngcontent-c14="" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534741248953/pdf-1.jpg">\n\n                        </div><div _ngcontent-c14="" class="pdfimg droppable ui-droppable" id="image2">\n\n                            <img _ngcontent-c14="" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534741248953/pdf-2.jpg">\n\n                        </div><div _ngcontent-c14="" class="pdfimg droppable ui-droppable" id="image3">\n\n                            <img _ngcontent-c14="" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534741248953/pdf-3.jpg">\n\n                        </div>\n\n                    <div _ngcontent-c14="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 308.328px; top: 164.297px;">\n                                   <div class="signhere appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365421 signed" style="border: none; margin-left: 3px; min-width: 28px; height: 45px; padding: 0px 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">Mani Narang<br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div>08/22/2018 10:28:19</div></div></div></div><div _ngcontent-c14="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 481.328px; top: 296.297px;">\n                          <div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">Mani Narang<br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div>08/22/2018 10:28:20</div></div><div _ngcontent-c14="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 177.328px; top: 487.297px;">\n                                    <div _ngcontent-c14="" class="form-group hideme" style="display: none; opacity: 0;">\n                                        <h6 _ngcontent-c14="">Signature</h6>\n                                    </div>\n                                <div class="signhere appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365423 signed" style="border: none; margin-left: 3px; min-width: 28px; height: 45px; padding: 0px 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">Mani Narang<br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div>08/22/2018 10:28:21</div></div></div></div></div>\n\n                </div>\n            '
// //var html = '\n                <div _ngcontent-c0="" style="height:100%"  class="col-md-8 col-sm-6 col-xs-12 divsize">\n             \n\n                    <div _ngcontent-c0="" class="inthis">\n                        <!--bindings={\n  "ng-reflect-ng-for-of": ""\n}--><div _ngcontent-c0="" class="pdfimg droppable ui-droppable" id="image0">\n\n                            <img _ngcontent-c0="" style="width:100%" crossorigin="anonymous" src="https://mybitrade.com:3001/uploadedpdf/1534826674536/pdf-0.png">\n\n                        </div><div _ngcontent-c0="" class="pdfimg droppable ui-droppable" id="image1">\n\n                            <img _ngcontent-c0="" style="width:100%" crossorigin="anonymous" src="https://mybitrade.com:3001/uploadedpdf/1534826674536/pdf-1.png">\n\n                        </div><div _ngcontent-c0="" class="pdfimg droppable ui-droppable" id="image2">\n\n                            <img _ngcontent-c0="" style="width:100%" crossorigin="anonymous" src="https://mybitrade.com:3001/uploadedpdf/1534826674536/pdf-2.png">\n\n                        </div><div _ngcontent-c0="" class="pdfimg droppable ui-droppable" id="image3">\n\n                            <img _ngcontent-c0="" style="width:100%" crossorigin="anonymous" src="https://mybitrade.com:3001/uploadedpdf/1534826674536/pdf-3.png">\n\n                        </div>\n\n                    <div _ngcontent-c0="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 513.328px; top: 38.2812px;">\n                                    <div _ngcontent-c0="" class="form-group hideme" style="display: none; opacity: 0;">\n                                        <h6 _ngcontent-c0="">Signature</h6>\n                                    </div>\n                                <div class="signhere appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365421 signed" style="border: none; margin-left: 3px; min-width: 28px; height: 45px; padding: 0px 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">Mani Narang<br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div>08/22/2018 11:43:19</div></div></div></div><div _ngcontent-c0="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="position: absolute; left: 208.328px; top: 167.281px;">\n                                    <div _ngcontent-c0="" class="form-group hideme" style="display: none; opacity: 0;">\n                                        <h6 _ngcontent-c0="">Initial</h6>\n                                    </div>\n                                <div class="removediv appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365422 signed" style="border: none; margin-left: 3px; min-width: 28px; height: 45px; padding: 0px 10px; z-index: 999; position: absolute;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">MN<br><br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div></div></div></div></div></div>\n\n                </div>\n            '
// var html = '\n                <div _ngcontent-c5="" class="col-md-8 col-sm-6 col-xs-12 divsize" style="height:100%; position:relative">\n             \n\n                    <div _ngcontent-c5="" class="inthis">\n                        <!--bindings={\n  "ng-reflect-ng-for-of": ""\n}--><div _ngcontent-c5="" class="pdfimg droppable ui-droppable" id="image0">\n\n                            <img _ngcontent-c5="" crossorigin="anonymous" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534920799080/pdf-0.png">\n\n                        </div><div _ngcontent-c5="" class="pdfimg droppable ui-droppable" id="image1">\n\n                            <img _ngcontent-c5="" crossorigin="anonymous" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534920799080/pdf-1.png">\n\n                        </div><div _ngcontent-c5="" class="pdfimg droppable ui-droppable" id="image2">\n\n                            <img _ngcontent-c5="" crossorigin="anonymous" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534920799080/pdf-2.png">\n\n                        </div><div _ngcontent-c5="" class="pdfimg droppable ui-droppable" id="image3">\n\n                            <img _ngcontent-c5="" crossorigin="anonymous" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1534920799080/pdf-3.png">\n\n                        </div>\n\n                    <div _ngcontent-c5="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 345.328px; top: 301.297px;">\n                                    <div _ngcontent-c5="" class="form-group hideme" style="display: none; opacity: 0;">\n                                        <h6 _ngcontent-c5="">Signature</h6>\n                                    </div>\n                                <div class="signhere appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365421 signed" style="border: none; margin-left: 3px; min-width: 28px; height: 45px; padding: 0px 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">Mani Narang<br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div>08/22/2018 12:25:06</div></div></div></div><div _ngcontent-c5="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 427.328px; top: 626.297px;">\n                                    <div _ngcontent-c5="" class="form-group hideme" style="display: none; opacity: 0;">\n                                        <h6 _ngcontent-c5="">Signature</h6>\n                                    </div>\n                                <div class="signhere appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365422 signed" style="border: none; margin-left: 3px; min-width: 28px; height: 45px; padding: 0px 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">Mani Narang<br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div>08/22/2018 12:25:08</div></div></div></div><div _ngcontent-c5="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="position: absolute; left: 446.328px; top: 921.297px;">\n                                    <div _ngcontent-c5="" class="form-group hideme" style="display: none; opacity: 0;">\n                                        <h6 _ngcontent-c5="">Name</h6>\n                                    </div>\n                                <div class="removediv appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365423 signed" style="border: none; margin-left: 3px; min-width: 28px; height: 45px; padding: 0px 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">Mani Narang<br><br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div></div></div></div></div><div _ngcontent-c5="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="position: absolute; left: 275.328px; top: 1055.3px;">\n                                    <div _ngcontent-c5="" class="form-group hideme" style="display: none; opacity: 0;">\n                                        <h6 _ngcontent-c5="">Email</h6>\n                                    </div>\n                                <div class="removediv appended 5b6051b345a03d0c89d36542 5b6051b345a03d0c89d365424 signed" style="border: none; margin-left: 3px; min-width: 28px; height: 45px; padding: 0px 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 24px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; font-family: serif; text-transform: lowercase;">maninder.pal19@gmail.com<br><br><div style="word-wrap: break-word;text-align: left;font-family: Cursive, Sans-Serif;font-size: 24px;font-weight: 400;font-style: italic;color: rgb(20, 83, 148);"></div></div></div></div></div></div>\n\n                </div>\n  '          
// var newhtml = cheerio.load(html);
// newhtml('body').css('line-height',1.2)
// // newhtml('.hideme').remove();
// // newhtml( '.canvas-element' ).each(function(index) { 
// //   console.log(index)
// //   if(index>0) {
// //  var newleft = parseInt(newhtml(this).css('left')) - 88;
// //  var newtop = parseInt(newhtml(this).css('top')) - 200;
// //   newhtml(this).css({left:newleft+'px' })
// //   newhtml(this).css({top: newtop+'px'})
// //   }
// // })
// console.log(newhtml.html())
// var options = {
//    "height": "10.5in",        // allowed units: mm, cm, in, px
// "width": "8in",
//  };
   
//   pdfhtml.create(newhtml.html(), options).toFile(path.join(__basedir, 'output.pdf'), function(err, res) {
//     if (err) return console.log(err);
//     console.log(res); // { filename: '/app/businesscard.pdf' }
//   });
// var url = "https://en.wikipedia.org/wiki/Main_Page"; 
// var output = path.join(__basedir, 'output.pdf'); 

// wpage.paperSize = { 
//    width: screen.width+'px', 
//    height: '1500px', 
   
//    margin: {
//       'top':'50px', 
//       'left':'50px', 
//       'rigtht':'50px' 
//    }, 
//    orientation:'portrait', 
//    header: { 
//       height: "1cm", 
//       contents: phantom.callback(function(pageNumber, nPages) { 
//          return "<h5>Header <b>" + pageNumber + " / " + nPages + "</b></h5>"; 
//       }) 
//    }, 
//    footer: { 
//       height: "1cm", 
//       contents: phantom.callback(function(pageNumber, nPages) {   
//          return "<h5>Footer <b>" + pageNumber + " / " + nPages + "</b></h5>"; 
//       }) 
//    } 
// } 
// wpage.open(url, function (status) { 
//    if (status !== 'success') { 
//       console.log('Page is not opening'); 
//       phantom.exit(); 
//    } else { 
//       wpage.render(output); 
//       phantom.exit();     
//    } 
// });
// page = WebPage.create();
// page.open('http://google.com');
// page.onLoadFinished = function() {
//    page.render('googleScreenShot' + '.png');
//    phantom.exit();}
// screenshot('http://google.com', path.join(__basedir, 'output.png')).done(function() {
//     console.log('http://google.com screenshot saved to google.png');
// });
// let generator = new SitePDF()

// generator.create('https://localhost:4201/pdfsign',path.join(__basedir, 'output.pdf'))
// .then(function(){
//   generator.destroy()
// })

// var pdf = new NodePDF('http://www.google.com', path.join(__basedir, 'output.pdf'), {
//     'viewportSize': {
//         'width': 1440,
//         'height': 900
//     }, 
//     'args': '--debug=true'
// });
 
// pdf.on('error', function(msg){
//     console.log(msg);
// });
 
// pdf.on('done', function(pathToFile){
//     console.log(pathToFile);
// });
 
// // listen for stdout from phantomjs
// pdf.on('stdout', function(stdout){
//      // handle
// });
 
// // listen for stderr from phantomjs
// pdf.on('stderr', function(stderr){
//     // handle
// });
webshot(`
<div _ngcontent-c11="" class="col-md-8 col-sm-6 col-xs-12 divsize" style="height:100%">


    <div _ngcontent-c11="" class="inthis">
        <!--bindings={
"ng-reflect-ng-for-of": ""
}--><div _ngcontent-c11="" class="pdfimg droppable ui-droppable" id="image0">

            <img _ngcontent-c11="" crossorigin="anonymous" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1535354180529/pdf-0.png">

        </div><div _ngcontent-c11="" class="pdfimg droppable ui-droppable" id="image1">

            <img _ngcontent-c11="" crossorigin="anonymous" style="width:100%" src="https://mybitrade.com:3001/uploadedpdf/1535354180529/pdf-1.png">

        </div>

    <div _ngcontent-c11="" class="pd0 draggable ui-draggable ui-draggable-handle canvas-element" style="z-index: 999; position: absolute; left: 426.078px; top: 36.2969px;">
                    <div _ngcontent-c11="" class="form-group hideme">
                        <h6 _ngcontent-c11="">Signature</h6>
                    </div>
                <div class="dell" style="text-align: right;  position: absolute;top: 0%; right: 0%;"><i style="font-size:24px; color:#ff0000;" class="fa"></i></div><div class="signhere appended 5b7fb5468f938d46984c1d2f 5b7fb5468f938d46984c1d2f1" style="border: 3px solid black;margin-left: 3px;min-width: 28px;height: 45px;  padding: 0 10px;"><div style="word-wrap: break-word; text-align: left; font-family: Cursive, Sans-Serif; font-size: 19px; font-weight: 400; font-style: italic"><div id="signtypeval5" style="height: 35px; width: auto; ">Mani Narang</div></div></div></div></div>

</div>
`, path.join(__basedir, 'output.png'), {siteType:'html'}, function(err) {
  // screenshot now saved to hello_world.png
});
})


//-------------------------------- update user signed image ------------------------------ //

router.post('/signeduserimage', function (req, res) {

  //var str = req.body.imagename;
  var url = req.body.imagename.split('/');;
  // console.log( url[ url.length - 1 ] ); // 2
  // console.log( url[ url.length - 2 ] + '/' + url[ url.length - 1 ]); 
  Document.findOne({ _id: req.body.docid, usertosign: req.body.userid }, function (err, doc) {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      var imagename = url[url.length - 2] + '/' + url[url.length - 1] + '.jpg';
      Document.updateOne({ _id: req.body.docid, usertosign: req.body.userid }, { $set: { userimage: imagename } }, function (err, result) {
        if (err) {
          res.status('400').json({
            message: err
          })
        }
        else {
          res.status(200).json({
            message: 'Success'
          })
        }
        //}
      })
    }
  })
})

module.exports = router;
