const Order = require("../models/order");
const catchAsyncError = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Get all Orders  =>  /api/v1/orders
exports.allOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({user:req.user._id});  
    res.status(200).json({
      success: true,
      results: orders.length,
      data: orders
    });
  });

// Post new Order =>   /api/v1/:id/order
exports.newOrder  = catchAsyncError(async (req, res, next) =>{
//add user to req.body    
    req.body.user = req.user._id;
    req.body.product = req.params.id;
    const order   = await Order.create(req.body);

    res.status(200).json({
        success : true,
        data : order
    });
})

// Delete Order =>   /api/v1/order/:id
exports.deleteOrder =catchAsyncError(async (req, res, next) =>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next (new ErrorHandler('Order not found', 404 ));
    }

    await order.remove();

    res.status(200).json({
        success : true,
        massage:'order Deleted',
        data : {}
    });
})