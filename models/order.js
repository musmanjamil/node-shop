const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  product: { 
      required:[true,'please enter product do you want order'],
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product" 
    },
    quantity:{
        type:Number,
        default:1
    },
    user:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required:true
    }
});
module.exports = mongoose.model("Order", orderSchema);
