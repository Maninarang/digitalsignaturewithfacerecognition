var mongoose = require( 'mongoose' );
var filetransfermailSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }, 
  fromemail: String,
  toemail: String,
  subject: String,
  attachment: {
         type: String,
         default : ''
     },
  mailcontent: {
    type: String,
    default : ''
},
  mailread: {
    type: String,
    default : 'No'
},
  mailtrash: {
    type: String,
    default : 'No'
},
password:String,
dateadded:{type : Date,default: Date.now}
});
mongoose.model('FileTransferMail', filetransfermailSchema);
