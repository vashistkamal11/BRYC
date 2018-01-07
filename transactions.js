const electron = require('electron')
const mongojs = require("mongojs")

var TransactionBuilder = function(user, to , purpose , amount , description , type){
  this.user = user;
  this.to = to;
  this.purpose = purpose;
  this.amount = amount;
  this.description = description;
  this.type = type;
  let today = new Date();
  this.when = "" + today.getDate()+ " " + today.getMonth() + " " + today.getFullYear() + " " + today.getHours() + " " +  today.getMinutes()+ " " + today.getSeconds();
}

var addTransaction = (transaction , callback)=>{
  let dbtransactions = mongojs('127.0.0.1/transactions', ['transactions']);
  dbtransactions.transactions.insert(transaction , (err , msg)=>{
    if(err){
      alert(err);
      return;
    }
    if(callback && typeof(callback) == "function"){
      callback(transaction);
    }
  })
}

var queryTransaction = (user, to , purpose , amount ,type ,when , callback)=>{
  let dbtransactions = mongojs('127.0.0.1/transactions' , ['transactions']);
  let selector = {}
  if(to != ""){
    selector["to"] = to;
  }
  if(user != ""){
    selector["user"] = user;
  }
  if(purpose != ""){
    selector["purpose"] = purpose;
  }
  if(type != ""){
    selector["type"] = type;
  }
  if(when != ""){
    selector["when"] = new RegExp(''+when);  //"/" + when + "/";//`/$`when;
  }
  console.log(selector);
  dbtransactions.transactions.find(selector , (err ,records)=>{
    if(err){
      alert(err);
      return;
    }
    console.log(records);
    if(callback && typeof(callback) == "function"){
      callback(records);
    }
  })
}
exports.TransactionBuilder = TransactionBuilder;
exports.addTransaction = addTransaction;
exports.queryTransaction = queryTransaction;
