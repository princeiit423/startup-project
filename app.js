const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const passport = require("passport");
const localStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
//const sendmail= require("./sendmail_middleware.js");
const methodOverride = require("method-override");
const Reciept= require("./models/reciept.js");

require("dotenv").config();
const port = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
//app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));

try {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to DB");
} catch (error) {
  console.log("error", error.message);
}

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.get("/", async (req, res, next) => {
  try {
    res.render("home/home.ejs");
  } catch (err) {
    next(err);
  }
});

app.get("/order", async (req, res, next) => {
  try {
    res.render("order/order.ejs");
  } catch (err) {
    next(err);
  }
});

app.post("/order", async(req,res,next)=>{
  try {
    const{name,upload,artType,frameSize,numFaces,price,address,contactNumber,whatsappNumber,dateOrdered}= req.body;
    const orderDetails= await  new Reciept({name,upload,artType,frameSize,numFaces,price,address,contactNumber,whatsappNumber,dateOrdered});
    await orderDetails.save();
    res.render("reciept/reciept.ejs", {orderDetails});
  
  } catch (err) {
    next(err);
  }
});

app.get("/reciept", async(req,res,err)=>{
  try {
    res.render("reciept/reciept.ejs");
  } catch (err) {
    next(err);
  }
});

app.get("/gallery", (req,res,next)=>{
  try {
    res.render("portfolio/portfolio.ejs");
  } catch (err) {
    next(err);
  }
})

app.get("/contact", (req,res,next)=>{
  try {
    res.render("contact/contact.ejs");
  } catch (err) {
    next(err);
  }
})
app.get("/dashboard",async(req,res,next)=>{
  try {
    const orders= await Reciept.find().sort({_id:-1});
    res.render("dashboard/dashboard.ejs", {orders});
  } catch (err) {
    next(err);
  }
})
app.get("/reciept/:id",async(req,res,next)=>{
  try {
    const id = req.params.id;
    const orderDetails= await Reciept.findById(id);
    res.render("reciept/reciept.ejs",{orderDetails});
  } catch (err) {
    next(err);
  }
})


app.use((err, req, res, next) => {
  res.render("error/error.ejs", { err });
});

app.listen(port, (req, res) => {
  console.log(`server is running on port:${port}`);
});
