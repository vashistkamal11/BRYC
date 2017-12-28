const electron = require('electron')
const mongojs = require("mongojs")

var TransactionBuilder = function(user, to , purpose , amount , description , type){
  this.user = user;
  this.to = to;
  this.purpose = purpose;
  this.amount = amount;
  this.description = description;
  this.type = type;
  this.when = new Date();
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

exports.TransactionBuilder = TransactionBuilder;
exports.addTransaction = addTransaction;
