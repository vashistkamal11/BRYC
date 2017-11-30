const electron = require("electron")
const ipc = electron.ipcRenderer
const menu = require('./../menu.js').menu
const mongojs = require("mongojs")

bill = document.getElementById('bill');
let warningflag = 0;
// warning for invald values

function invalidvaluewarning(){
  if(warningflag == 0){
    let warn = document.createElement("warning");
    warn.id = "warning"
    warn.innerHTML = "Wrong Values entered";
    let place = document.getElementById('additem.sbutton');
    let form  = document.getElementById('additem')
    form.insertBefore(warn, place)
    let nextline = document.createElement("br");
    form.insertBefore(nextline, place)
    warningflag = 1;
    console.log(warn.outerHTML)
  }
}

// function for transferring new item to bill
additem.addEventListener('submit', function(event){

    event.preventDefault();

    let cnt = 0;
    let elem = document.getElementById('additem').elements

    let newrow = bill.insertRow(bill.rows.length-1);
    let values =[] // array for storing values sent
    let valuesref =[] // for keeping reference to clean up later

    for(let i=0;i<elem.length;i+=1){
        let tmp = elem[i];
        if(tmp.type === "number" || tmp.type === "text"){
          values[cnt] = tmp.value;
          valuesref[cnt]=tmp
          cnt+=1;
        }
    }
    // validating data here
    if(values[0]=="" || values[1]==""){
      invalidvaluewarning();
      return;
    }
    if((values[2] == "")){
      if(menu["item"+values[0]].price == null){
        invalidvaluewarning();
        return;
      }
    }
    else{
      if(values[2]=="h" || values[2]=="f"){
        if(menu["item"+values[0]].price != null){
         invalidvaluewarning();
         return;
        }
      }
      else{
        invalidvaluewarning();
        return;
      }
    }
    // in case same item ordered again
    for(let i=1;i<(bill.rows.length-1);i++){
      row = bill.rows[i]
      for(let j=0;j<row.cells.length;j++){
        if(j==0){
        cell = row.cells[j]
        ncell = row.cells[j+1]
        if((cell.innerHTML == menu["item"+values[0]].name) && ((ncell.innerHTML == "Half" && values[2]=="h")||(ncell.innerHTML == "Full" && values[2]=="f")||(ncell.innerHTML=="----"))){

          let quantity = row.cells[2];
          let price = row.cells[3];
          let total = document.getElementById('total');
          total.innerHTML = parseInt(total.innerHTML) - parseInt(row.cells[3].innerHTML);
          row.cells[2].innerHTML = parseInt(row.cells[2].innerHTML) + parseInt(values[1]);
          row.cells[3].innerHTML = row.cells[2].innerHTML*(menu["item"+values[0]]["price" + values[2]]);
          total.innerHTML = parseInt(total.innerHTML)+ parseInt(row.cells[3].innerHTML);

          for(let i=0;i<valuesref.length;i+=1)
            valuesref[i].value = null
          if(warningflag == 1){
          let warn = document.getElementById('warning')
          warn.parentNode.removeChild(warn)
          warningflag = 0;
          }

          return;
        }
      }
    }
  }
  // adding data to table
    let newcell = newrow.insertCell(0);
    newcell.appendChild(document.createTextNode(menu["item"+values[0]].name));

    newcell = newrow.insertCell(1);
    if(values[2]=="h")
    newcell.appendChild(document.createTextNode("Half"));
    else if(values[2]=="f")
    newcell.appendChild(document.createTextNode("Full"));
    else
    newcell.appendChild(document.createTextNode("----"));

    newcell = newrow.insertCell(2);
    newcell.appendChild(document.createTextNode(values[1]));

    newcell = newrow.insertCell(3);
    newcell.appendChild(document.createTextNode(values[1]*(menu["item"+values[0]]["price" + values[2] ])))
    let total = document.getElementById('total')
    total.innerHTML = parseInt(total.innerHTML) + parseInt(newcell.innerHTML)
    btnclose = document.createElement("button")
    btnclose.innerHTML = "remove"
    btnclose.id = "remove"
    newcell = newrow.insertCell(4);
    newcell.appendChild(btnclose)
// resetting values of form ,remove warning
    for(let i=0;i<valuesref.length;i+=1)
      valuesref[i].value = null
    if(warningflag == 1){
    let warn = document.getElementById('warning')
    warn.parentNode.removeChild(warn)
    warningflag = 0;
    }
})

let submitform = document.getElementById('submittodb')
submitform.addEventListener('submit', function(event){
  event.preventDefault();
  // adding bill
  let dbb = mongojs('127.0.0.1/bills', ['bills'])
  let dbds = mongojs('127.0.0.1/dailysell', ['dailysell'])
  let elements = [];
  for(let i=0;i<(bill.rows.length-1);i++){
    let element = {};
    let row = bill.rows[i];
    element.name = row.cells[0].innerHTML;
    element.plate = row.cells[1].innerHTML;
    element.quantity = row.cells[2].innerHTML;
    element.price = row.cells[3].innerHTML;
    elements[i-1] = element
  }
  let exportbill ={}

  var today = new Date();

  exportbill.id = "bryc" + today.getDate() + today.getHours()+ today.getMonth() + today.getMinutes() + today.getFullYear() + today.getSeconds();
  exportbill.customerName = document.getElementById('customername').innerHTML;
  exportbill.contactinfo = document.getElementById('contactno').innerHTML;
  exportbill.elements = elements
  dbb.bills.insert(exportbill , (err, records)=>{
    if(err){
      alert(err.messgae+"Error");
      return;
    }
    alert('operation successfull');
  })
  // adding to dailysell
  let exporttodailysell = {};
  let newdailysell ={};
  let findflag=0;
  dbds.dailysell.find({date:""+today.getDate()+today.getMonth()+today.getFullYear()}, (err, records)=>{
    if(err){
      alert(err.message+"Error");
      return;
    }
    if(records.length==0){
      newdailysell ={}
      newdailysell.totalsale = 0;
      newdailysell.date = (""+today.getDate()+today.getMonth()+today.getFullYear());
    }
    else{
      findflag = 1;
      newdailysell = records[0]
    }
    for(let i=0;i<elements.length;i++){
       if(newdailysell[elements[i].name + elements[i].plate] == null){
         newdailysell[elements[i].name + elements[i].plate] = {
                    quantity : elements[i].quantity,
                    totalsold : elements[i].price
         }
       }
       else{
         newdailysell[elements[i].name + elements[i].plate].quantity = parseInt(newdailysell[elements[i].name + elements[i].plate].quantity) + parseInt(elements[i].quantity);
         newdailysell[elements[i].name + elements[i].plate].totalsold = parseInt(newdailysell[elements[i].name + elements[i].plate].totalsold) + parseInt(elements[i].price);
       }
       newdailysell.totalsale = parseInt(newdailysell.totalsale) + parseInt(elements[i].price);
    }
    if(findflag == 1){
      console.log("found");
      dbds.dailysell.update({date:""+today.getDate()+today.getMonth()+today.getFullYear()}, newdailysell);
    }else {
      console.log("new");
      dbds.dailysell.insert(newdailysell , (err, records)=>{
        if(err){
          alert("error submiting data to dailysell" + err);
          return;
        }
      })
    }
    location.reload()
  })
  //location.reload()
})
