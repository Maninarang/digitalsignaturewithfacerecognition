var mongoose = require( 'mongoose' );
var smartmailSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }, 
  fromemail: String,
  toemail: String,
  subject: {
    type: String,
    default : 'No Subject'
},
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
dateadded:{type : Date,default: Date.now}
});
mongoose.model('SmartMail', smartmailSchema);
