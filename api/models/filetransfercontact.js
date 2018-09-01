var mongoose = require( 'mongoose' );
var filetransfercontactSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }, 
  name: String,
  company: {
    type: String,
    default : ''
},
  contact: {
    type: String,
    default : ''
},
  email: String
});
mongoose.model('FileTransferContact', filetransfercontactSchema);