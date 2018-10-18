var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

const SendOtp = require('sendotp');
const sendOtp = new SendOtp('231274A7Y7SKOlQx5b6f45b4');
sendOtp.setOtpExpiry('5');


var models = {};
loadModels =  function(){
  models = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
}
loadModels();

saveModels = function(){
    fs.writeFileSync('./data.json', JSON.stringify(models) , 'utf-8');
}

var pendingReviews = {};
loadPendingReviews =  function(){
  pendingReviews = JSON.parse(fs.readFileSync('./pendingReviews.json', 'utf8'));
}
loadPendingReviews();

savePendingReviews = function(){
    fs.writeFileSync('./pendingReviews.json', JSON.stringify(models) , 'utf-8'); 
}

var modelNode = {
  loan:{
     approved: false,
     confirmed: false,
     amount: 0,
     emi: 0,
     term: "",
     nextPaymenDate: "",
     paymentLink: ""
  },
  details:{
     phone: "",
     story:"",
     amount:"",
     images: []
  },
  otherInfo:{
     name:"",
     address:"",
     angels:[],
     documents: []
  }
};

modelNode.new = ()=>{
  return JSON.parse(JSON.stringify(modelNode));
}


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('public'));
app.get("/:data",(req,res)=>{
   res.sendFile(__dirname+"/public/index.html");
});

app.get("/api/getOTP/:number",(req,res)=>{
  var number = req.params.number;
  sendOtp.send(number, "DUROTP", function (error, status, otp_res) {
    var response = {
      otp_status: (status&&status.type == "success"),
      phone_number: number,
      error: error
    };
    res.send(response);
  });
});

app.get("/getModel/:number",(req,res)=>{
    loadModels();
    loadPendingReviews();
    if(pendingReviews[req.params.number])
      res.send(pendingReviews[req.params.number]);
    else res.send(models[req.params.number]);
});

app.post("/saveModel",(req,res)=>{
  var model = req.body;
  models[model.details.phone] = model;
  if(pendingReviews[model.details.phone]&&pendingReviews[model.details.phone].loan.approved){
    pendingReviews[model.details.phone] = model;
    savePendingReviews();
  }
  saveModels();
  res.send(models[model.details.phone]);
});

app.post("/submitReview",(req,res)=>{
  var model = req.body;
  var loan = model.details.amount; 
  models[model.details.phone] = model;
  pendingReviews[model.details.phone] = model;
  pendingReviews[model.details.phone].loan.approved = true;
  pendingReviews[model.details.phone].loan.amount = loan + " INR";
  pendingReviews[model.details.phone].loan.emi = (parseInt(loan)/4)+" INR";
  pendingReviews[model.details.phone].loan.term = "4 months";
  pendingReviews[model.details.phone].loan.nextPaymenDate = "12th September 2018";
  savePendingReviews();
  saveModels();
  res.send(model);
});

app.get("/loan/:id",(req,res)=>{
    var id = base64toString(req.params.id);
    res.send(pendingReviews[id]);
});

app.get("/confirm/loan/:id",(req,res)=>{
  var id = base64toString(req.params.id);
  pendingReviews[id].loan.confirmed = true;
  res.send(pendingReviews[id]);
});

app.get("/api/verifyOtp/:phone_number/:otp", function (req, res) {
  var otp = req.params.otp;
  var number =  req.params.phone_number;

  sendOtp.verify(number, otp, function (err, data, response) {
    var response = {
      status: data&&data.type == 'success'
    }

    if(response.status){
      models[number] = modelNode.new();
      models[number].details.phone = number;
      saveModels();
    }
    res.send(response);
  });
});

PORT = 3000;
app.listen(process.env.PORT || PORT, () => console.log(`microlending app listening on port ${PORT}!`));


function base64toString(s) {
  console.log(s);
  if (!s) return s;
  else return Buffer.from(s, 'base64').toString();
}

function getObjectFromBase64(data) {
  try {
    console.log(base64toString(data));
    return JSON.parse(base64toString(data));
  } catch (ex) {
    return {}
  }
}

/**
 * {
 *   "ph":{
 *       loan:{
 *          approved: false,
 *          amount: 0,
 *          emi: 0,
 *          term: "",
 *          nextPaymenDate: "",
 *          paymentLink: ""
 *       },
 *       details:{
 *          phone: "",
 *          story:"",
 *          amount:"",
 *          images: []
 *       },
 *       otherInfo:{
 *          name:"",
 *          address:"",
 *          angels:[],
 *          documents: []
 *       }
 *    }
 * }
 */