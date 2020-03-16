const Product = require("../models/product");
const catchAsyncError = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Get all Products  =>  /api/v1/products
exports.allProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    results: products.length,
    data: products
  });
});


// Post new Product =>   /api/v1/product/new
exports.creatProduct =catchAsyncError(async (req, res, next) =>{
    req.body.publisher= req.user.id;
    const product = await Product.create(req.body);

    res.status(200).json({
        success : true,
        data : product
    });
})

// Get single Product =>   /api/v1/product/:id
exports.getProduct = catchAsyncError(async (req, res, next) =>{

    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Prodcut not found.', 404));
    }

    res.status(200).json({
        success : true,
        data : product
    });
})

// update Product =>   /api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) =>{

    const product = await Product.findById(req.params.id);
    if(product.publisher != req.user.id){
        return next(new ErrorHandler('ivalid request only publisher can update product', 500));
    }

    if(!product) {
        return next(new ErrorHandler('Prodcut not found.', 404));
    }
    await product.updateOne(req.body);

    res.status(200).json({
        success : true,
        data : product
    });
})

// Delete Product =>   /api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) =>{

    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Prodcut not found.', 404));
    }
    if(product.publisher!=req.user.id){
        return next(new ErrorHandler('invalid requset only publisher can delete', 500));
    }
    await product.remove();

    res.status(200).json({
        success : true,
        massage:'Product Deleted sccessfuly',
        data : product
    });
})