var mongoose = require( 'mongoose' );
var contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
 // docrefId: String,
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  subject: String,
  message: String,
 // priority: Number,
//   status: {
//      type: String,
//      default : 'Not Signed'
//  },
//  saveddocId: {
//    type: mongoose.Schema.Types.ObjectId,
//    ref: 'Document',
//  },
 type: String
});
mongoose.model('Contact', contactSchema);
