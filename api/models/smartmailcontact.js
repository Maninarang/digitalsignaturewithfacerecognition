var mongoose = require( 'mongoose' );
var smartmailSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }, 
  name: String,
  company: String,
  contact: String,
  email: String,
  mailsent: Number
});
mongoose.model('SmartMailContact', smartmailSchema);
