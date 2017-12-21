const electron = require('electron')
const mongojs = require("mongojs")

var transactionbuilder = (user, to , purpose , amount , description)=>{
  this.user = user;
  this.to = to;
  this.purpose = purpose;
  this.amount = amount;
  this.description = description;
  this.when = new Date();
}

var addTransaction = (transaction)=>{
  let dbtransactions = mongojs['127.0.0.1/transactions', ['transactions']];
  dbtransactions.transactions.insert(transaction , (err , msg)=>{
    if(err){
      alert(err);
      return;
    }
  })
}

exports.transactionbuilder = transactionbuilder;
exports.addTransaction = addTransaction;
