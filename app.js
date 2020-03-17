const express         = require('express');
const app             = express();
const productRoutes   = require('./routes/products');
const orderRoutes     = require('./routes/orders');
const userRoutes      = require('./routes/users');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
const mongoose        = require('mongoose');
const helmet          = require('helmet');
const xss             = require('xss-clean');
const hpp             = require('hpp');
const rateLimit       = require('express-rate-limit');
const cors            = require('cors');
const errorMiddleware = require('./middlewares/error');
const mongoSanitize   = require('express-mongo-sanitize');


mongoose.connect('mongodb+srv://node-shop:nodeshop@cluster0-2zl5w.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then(con => console.log(`MongoDB connected to: ${con.connection.host}`))
.catch(err => console.log(err));;
//body parser
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));
//cookie parser
app.use(cookieParser());
app.use('/api/v1', productRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', userRoutes);

//sanitize data
app.use(mongoSanitize());

//error midleware
app.use(errorMiddleware);

//set secutiy headers
app.use(helmet());

//prevent XXS attacks
app.use(xss());

//rate limiting
const limiter = rateLimit({
    windowMs:10* 60* 1000,
    max:100
})

app.use(limiter);

//Enable CORS
app.use(cors());

//prevent http params polution
app.use(hpp());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT} in ${process.env.NODE_ENV} mode.`)
});