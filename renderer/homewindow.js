const electron = require('electron')
const ipc = electron.ipcRenderer
const mongojs = require("mongojs")
const menufunctions = require('./../menu.js')

$(document).ready(function(){
  document.getElementById("options").style.padding = "100px 300px ";
  dbtransactions = mongojs('127.0.0.1/transactions' , ['transactions']);
  dbsafes = mongojs('127.0.0.1/safes' , ['safes']);

  $("#newbill").click( (event)=>{
    ipc.send('newbillwindow')
  })

  $("#query").click((event)=>{
    ipc.send('newquerywindow')
  })

  $("#menu").click( (event)=>{
    ipc.send('newmenuwindow');
  })

  $("#smallsafebutton").click((e)=>{
    dbsafes.safes.find({"type":"small"} , (err , records)=>{
      if(err){
        alert(err);
        return;
      }
      if(records.length == 0){
        document.getElementById("smallsafeamount").innerHTML = "Current Amount : 0";
      }
      else{
      document.getElementById("smallsafeamount").innerHTML = "Current Amount : " + records[0].amount;
    }
      $("#smallsafedialog").modal("show");
    })
  })

  $("#largesafebutton").click((e)=>{
    dbsafes.safes.find({"type":"large"} , (err , records)=>{
      if(err){
        alert(err);
        return;
      }
      console.log(records);
      if(records.length == 0){
        document.getElementById("largesafeamount").innerHTML = "Current Amount : 0";
      }
      else{
      document.getElementById("largesafeamount").innerHTML = "Current Amount : " + records[0].amount;
    }
    $("#largesafedialog").modal("show");
    })
  })
  $("#smallsafesave").click(smallSafeTransaction);
  $("#largesafesave").click(largeSafeTransaction);
})

// transaction to small smallsafe
var smallSafeTransaction = ()=>{
  let amount = document.getElementById("smallsafetransactionamount").value;
  let description = document.getElementById("smallsafetransactiondescription").value;
  let transaction = {
    "safetype" : "small",
    "amount" : amount,
    "description" : description
  }
  dbsafes.safes.find({"type":"small"}  , (err,records)=>{
    if(err){
      alert(err);
      return;
    }
    let safe = {
      "type" : "small"
    }
    if(records.length == 0){
      safe.amount =0;
    }
    else{
      safe.amount = parseInt(records[0].amount) + parseInt(amount)
    }

  dbsafes.safes.remove({"type":"small"} , (err,msg)=>{
    if(err){
      alert(err);
      return;
    }

    dbsafes.safes.insert(safe , (err , msg)=>{
      if(err){
        alert(err);
        return;
      }

      dbtransactions.transactions.insert(transaction , (err , msg)=>{
        if(err){
          alert(err);
          return;
        }

        alert(msg);
        $("#smallsafedialog").modal("hide");
      })
    })
  })
})
}

// transaction to big safe
var largeSafeTransaction = ()=>{
  let amount = document.getElementById("largesafetransactionamount").value;
  let description = document.getElementById("largesafetransactiondescription").value;
  console.log(amount);
  console.log(description);
  let transaction = {
    "safetype" : "large",
    "amount" : amount,
    "description" : description
  }
  dbsafes.safes.find({"type":"large"}  , (err,records)=>{
    if(err){
      alert(err);
      return;
    }
    let safe = {
      "type" : "large"
    }
    if(records.length == 0){
      safe.amount =0;
    }
    else{
      safe.amount = parseInt(records[0].amount) + parseInt(amount)
    }
  console.log(safe);
  dbsafes.safes.remove({"type":"large"} , (err,records)=>{
    if(err){
      alert(err);
      return;
    }

    dbsafes.safes.insert(safe , (err , msg)=>{
      if(err){
        alert(err);
        return;
      }

      dbtransactions.transactions.insert(transaction , (err , msg)=>{
        if(err){
          alert(err);
          return;
        }

        alert(msg);
        $("#largesafedialog").modal("hide");
      })
    })
  })
})
}
