const electron = require('electron')
const ipc = electron.ipcRenderer
const mongojs = require("mongojs")
const menufunctions = require('./../menu.js')
const users = require('./../users.js')
const transactionfunctions = require('./../transactions.js')
const {dialog} = require('electron').remote;
const remote = require('electron').remote;
const fs = remote.require('fs');
const purposes = require('./../purposes.js')

let bgchangetime = 5000;
let filename = "/home/vashist/Desktop/bryc/BRYC/resources/2.jpeg";
let imgpath = "/home/vashist/Desktop/bryc/BRYC/resources/";
let imgno = 1;

$ = require('jquery');
jQuery = require('jquery');
$(document).ready(function(){
  $("#options").jqxMenu({ width: '150', mode: 'vertical'});

  //$("#list").jqxComboBox({theme: "shinyblack" ,  source: source, width: 200, height: 15 ,});

  dbparameters = mongojs('127.0.0.1/parameters' , ['parameters']);
  dbparameters.parameters.find({"type" : "nooftables"} , (err,records)=>{
    if(err){
      alert(err);
      return;
    }
    addbuttons(records[0].value);
  })
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

  $('#userbtn').click((event)=>{
    ipc.send('newuserwindow');
  })
  $("#smallsafebutton").click((e)=>{
    dbparameters.parameters.find({"type":"smallsafe"} , (err , records)=>{
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
    dbparameters.parameters.find({"type":"largesafe"} , (err , records)=>{
      if(err){
        alert(err);
        return;
      }
      if(records.length == 0){
        document.getElementById("largesafeamount").innerHTML = "Current Amount : 0";
      }
      else{
      document.getElementById("largesafeamount").innerHTML = "Current Amount : " + records[0].amount;
    }
    $("#largesafedialog").modal("show");
    })
  })
  $("#tablesbtn").click((e)=>{
    $("#nooftablesdialog").modal("show");
  })
  $("#purposebtn").click((e)=>{
    $('#purposedialog').modal('show');
  })
  $("#smallsafesave").click(smallSafeTransaction);
  $("#largesafesave").click(largeSafeTransaction);
  $('#nooftablessave').click(tablesave);
  $("#purposeadd").click(purposeAdd);
  $("#purposeremove").click(purposeRemove);
  purposesource = [];
  purposes.createPurposeSource(purposesource , createjqxComboBox);

  setInterval(changebg , bgchangetime);
})
// crate jqxComboBox
var createjqxComboBox= (purposesource)=>{
 $("div[type = 'purpose']").jqxComboBox({source : purposesource ,width : '400px' ,height :'20px',theme: 'shinyblack'});
 //.map((ele , i)=>{
//  ele.jqxComboBox({theme : "shinyblack" , source : purposesource , width: 200 , height : 20 ,})
// })
}

//save no of table
var tablesave = ()=>{
  dbparameters.parameters.update({"type":"nooftables"} , {$set :{"value": parseInt(document.getElementById("nooftables").value)}} , {upsert:true} , (err,msg)=>{
    if(err){
      alert(err);
      return;
    }
    addbuttons(parseInt(document.getElementById("nooftables").value));
    $('#nooftablesdialog').modal('hide');
  })
}

//background change function
var changebg = ()=>{
  imgno = parseInt(imgno)+1;
  let newfilename = imgpath + imgno+".jpeg";
  filename = newfilename;
  if(imgno<=2){
    $('#img1').css('display', 'none')
    $('#img1').attr('src' , filename);
    $('#img1').css('display', 'block')
  }
  else{
    document.getElementById('img1').src = imgpath + 1 + ".jpeg";
    filename = imgpath + imgno+ ".jpeg";
    imgno=1;
  }
}
// addPurpose
var purposeAdd = ()=>{
    let newpurpose = new  purposes.PurposeBuilder(document.getElementById('purposename').value);
    purposes.addPurpose(newpurpose);
}
//removePurpose
var purposeRemove = ()=>{
  purposes.removePurpose(document.getElementById("purposename").value);
}
// transaction to small smallsafe
var smallSafeTransaction = ()=>{
  let amount = document.getElementById("smallsafetransactionamount").value;
  let description = document.getElementById("smallsafetransactiondescription").value;
  let user = document.getElementById("smallsafetransactionuser").value;
  let to = document.getElementById("smallsafetransactionto").value;
  let purpose = $("#smallsafetransactionpurpose").val();

  let transaction = new transactionfunctions.TransactionBuilder(user , to , purpose , amount , description,"small");

  dbparameters.parameters.update({"type":"smallsafe"}, { $inc : {"amount" : parseInt(amount) } } , {upsert:true} , (err,records)=>{
    if(err){
      alert(err);
      return;
    }
    transactionfunctions.addTransaction(transaction,()=>{
      $("#smallsafedialog").modal("hide");
    })
  })
}

// transaction to big safe
var largeSafeTransaction = ()=>{
  let amount = document.getElementById("largesafetransactionamount").value;
  let description = document.getElementById("largesafetransactiondescription").value;
  let user = document.getElementById("largesafetransactionuser").value;
  let to = document.getElementById("largesafetransactionto").value;
  let purpose = $("#largesafetransactionpurpose").val();
  let transaction =  new transactionfunctions.TransactionBuilder(user , to , purpose , amount , description, "large");
    dbparameters.parameters.update({"type":"largesafe"}, {$inc:{"amount" : parseInt(amount)}} ,{upsert:true}, (err,msg)=>{

      if(err){
        alert(err);
        return;
      }

      transactionfunctions.addTransaction(transaction,()=>{
        $("#largesafedialog").modal("hide");
      })
      })
}

var addbuttons = function(numberbtn){
  let tdiv  = document.getElementById("tables");
  tdiv.innerHTML = "";
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
