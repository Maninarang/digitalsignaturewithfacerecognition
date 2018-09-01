var mongoose = require( 'mongoose' );
var documentStatusSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
 },
  documentid: String,
  documentstatus: {type:String,default:'Initialize'}
});
mongoose.model('DocumentStatus', documentStatusSchema);
