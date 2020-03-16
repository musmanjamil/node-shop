const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    
  name: {
    type: String,
    required: [true, 'Please enter product name']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price']
  },
  publisher:{
    type: mongoose.Schema.ObjectId, 
    ref: "User",
    required:true
  }
});
module.exports = mongoose.model("Product", productSchema);
