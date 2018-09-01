var mongoose = require( 'mongoose' );
var documentSchema = new mongoose.Schema({
  documentid: String,
  userid: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User'
  },
  usertosign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
 },
  documenthtml: {type:String,default: ''},
  withimage: Boolean,
  priority : Number,
  userimage:{type:String,default: ''},
  uservideo:{type:String,default: ''},
  sendername:String,
  location: {type:String,default: ''},
  actionrequired:{type:String,default:'Not Signed'},
  expiration : String,
  dateadded:{type : Date,default: Date.now},
  signedTime:{type:Date,default:''}
});
mongoose.model('Document', documentSchema);
