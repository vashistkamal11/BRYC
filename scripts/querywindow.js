const mongojs = require("mongojs")
const transactionfunctions = require('./../transactions.js')

$ = require('jquery');
jQuery = require('jquery');

let dbds = mongojs('127.0.0.1/dailysell',['dailysell'])
$(document).ready(function(){
$('#dailysellform').submit(dailysellquery);
$('#transactionquery').submit(transactionqueryfunction);
})
//query functions
var dailysellquery = (event)=>{
  event.preventDefault();
  let qdate = document.getElementById('dailysellform').elements[0].value;
  dbds.dailysell.find({date:""+qdate}, (err, records)=>{
    if(err){
      alert("error:"+err.message)
      return;
    }
    if(records.length==0){
      alert("no records found");
      return;
    }
    let table = document.getElementById('results');
    table.innerHTML = "";
    let tableheadings = document.createElement('tr');
    let heading = document.createElement('th');
    heading.innerHTML = "item name";
    tableheadings.appendChild(heading);

    heading = document.createElement('th');
    heading.innerHTML = "quantity sold";
    tableheadings.appendChild(heading);

    heading = document.createElement('th');
    heading.innerHTML = "Amount";
    tableheadings.appendChild(heading);
    table.appendChild(tableheadings);
    let total = 0;
    for (i in records[0]){
    if(i != "_id" && typeof(records[0][i]) == 'object' ){
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let obj = records[0][i];
        td1.innerHTML = i;
        td2.innerHTML = obj["quantity"];
        td3.innerHTML = obj["totalsold"];
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
      }
    }
   tableHeading("Total Sale" , table , records[0].totalsale);
   tableHeading("Discount" , table , records[0].discount);
   tableHeading("Total" , table , parseInt(records[0].totalsale) - parseInt(records[0].discount));

document.body.appendChild(table);
  })
}

var tableHeading = (title , table , value)=>{
  let th = document.createElement('tr');
  let td1 = document.createElement('th');
  let td2 = document.createElement('th');
  let td3 = document.createElement('th');
  td1.innerHTML = title;
  td3.innerHTML = value;
  th.appendChild(td1);
  th.appendChild(td2);
  th.appendChild(td3);
  table.appendChild(th);
}

var transactionqueryfunction = (e)=>{
  e.preventDefault();
  console.log(new Date());
  let user = $('#transactionuser').val();
  let type = $('#transactionsafetype').val();
  let when = $('#transactiondate').val();
  let purpose = $('#transactionpurpose').val();
  let to = $('#transactionto').val();
  transactionfunctions.queryTransaction(user , to , purpose,null ,type ,when , transactiontable );
}

var transactiontable = (records)=>{
  let table = document.getElementById("results");
  table.innerHTML ="";
  let tableheadings = document.createElement('tr');

  let heading = document.createElement('th');
  heading.innerHTML = "user";
  tableheadings.appendChild(heading);

  heading = document.createElement('th');
  heading.innerHTML = "reciever";
  tableheadings.appendChild(heading);

  heading = document.createElement('th');
  heading.innerHTML = "safe type";
  tableheadings.appendChild(heading);

  heading = document.createElement('th');
  heading.innerHTML = "Date";
  tableheadings.appendChild(heading);

  heading = document.createElement('th');
  heading.innerHTML = "purpose";
  tableheadings.appendChild(heading);

  heading = document.createElement('th');
  heading.innerHTML = "amount";
  tableheadings.appendChild(heading);

  heading = document.createElement('th');
  heading.innerHTML = "description";
  tableheadings.appendChild(heading);

  table.appendChild(tableheadings);

  for(let i =0;i<records.length;i++){
    let newrow = document.createElement('tr');

    let newcell = document.createElement('td');
    newcell.innerHTML = records[i].user;
    newrow.appendChild(newcell);

    newcell = document.createElement('td');
    newcell.innerHTML = records[i].to;
    newrow.appendChild(newcell);

    newcell = document.createElement('td');
    newcell.innerHTML = records[i].type;
    newrow.appendChild(newcell);

    newcell = document.createElement('td');
    newcell.innerHTML = records[i].when;
    newrow.appendChild(newcell);

    newcell = document.createElement('td');
    newcell.innerHTML = records[i].purpose;
    newrow.appendChild(newcell);

    newcell = document.createElement('td');
    newcell.innerHTML = records[i].amount;
    newrow.appendChild(newcell);

    newcell = document.createElement('td');
    newcell.innerHTML = "-";
    newcell.txt = records[i].description;
    newrow.appendChild(newcell);
    console.log(newcell.txt);
    table.appendChild(newrow);
  }
}
