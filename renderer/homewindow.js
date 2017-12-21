const electron = require('electron')
const ipc = electron.ipcRenderer
const mongojs = require("mongojs")
const menufunctions = require('./../menu.js')

$(document).ready(function(){
//  document.getElementById("options").style.padding = "100px 150px ";
  addbuttons(8);
  dbtransactions = mongojs('127.0.0.1/transactions' , ['transactions']);
  dbsafes = mongojs('127.0.0.1/safes' , ['safes']);
  $("#packingbtn , #deliverybtn").click((event)=>{
    ipc.send('newbillwindow' , event.target.innerHTML)
  })
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
  dbsafes.safes.update({"type":"small"}, { $inc : {"amount" : parseInt(amount) } } , {upsert:true} , (err,records)=>{
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
}

// transaction to big safe
var largeSafeTransaction = ()=>{
  let amount = document.getElementById("largesafetransactionamount").value;
  let description = document.getElementById("largesafetransactiondescription").value;

  let transaction = {
    "safetype" : "large",
    "amount" : amount,
    "description" : description
  }
    dbsafes.safes.update({"type":"large"}, {$inc:{"amount" : parseInt(amount)}} ,{upsert:true}, (err,records)=>{

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
}

var addbuttons = function(numberbtn){
  let tdiv  = document.getElementById("tables");
  for(let i = 1 ;i<=numberbtn;i++){
    let newbtn = document.createElement("button");
    newbtn.className+= "btn btn-success btn-circle btn-lg";
    newbtn.innerHTML = i;
    newbtn.addEventListener('click' , (event)=>{
      ipc.send('newbillwindow' , "table " + event.target.innerHTML)
    })
    tdiv.appendChild(newbtn);
  }
}
