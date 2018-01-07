const electron = require("electron")
const ipc = electron.ipcRenderer
const mongojs = require("mongojs")
const menufunctions = require('./../menu.js')
const remote = electron.remote;


window.onload = function(){
  bill = document.getElementById('bill');
  menuobject = {}; // for storing food items in form of menu i.e. category wise
  fooditems = {};// for storing list of food items objects
  menufunctions.menuBuilder(menuobject,createMenu);
  menufunctions.getFoodItems(fooditems);
  document.getElementById('discount').addEventListener('change', discount);
  document.getElementById('submittodb').addEventListener('submit', submitformfunction);

   dbb = mongojs('127.0.0.1/bills', ['bills']);
   dbds = mongojs('127.0.0.1/dailysell', ['dailysell']);
   dbsafes = mongojs('127.0.0.1/safes', ['safes']);
   dbtransactions = mongojs('127.0.0.1/transactions' , ['transactions']);
}
// function to createMenu
function createMenu(menuarg){
  for(key in menuarg){
    let dv = document.createElement('div');
    dv.className = "arrow-down";
    let idv = document.createElement('div');
    idv.className = "arrow-down-inner";
    dv.appendChild(idv);
    let tablist=document.getElementById('tablist');
    let item = document.createElement('li');
    item.className  = "tab fancyTab ";
    item.appendChild(dv)
    let write = document.createElement('a');
    write.innerHTML = key;
    write.id = "tab";
    write.addEventListener('click' , changeTab);
    item.appendChild(write);
    let adv = document.createElement('div');
    adv.className = "whiteBlock";
    item.appendChild(adv);
    tablist.appendChild(item);
  }
}
// function to remove item from bill
function removeitemfrombill(event){
  row = event.target.parentNode.parentNode
  document.getElementById("total").innerHTML = parseInt(document.getElementById("total").innerHTML) - parseInt(row.cells[3].innerHTML);
  row.remove();
}
//discount
function discount(event){
  let dis = document.getElementById('discount').value;
  let ttl = document.getElementById('total');
  ttl.innerHTML = parseInt(ttl.innerHTML) - parseInt(dis);
}
// click function for tabs
function changeTab(event){
  let tabs = document.getElementsByClassName('tab');
  for(i=0; i <tabs.length;i++){
    tabs[i].classList.remove("active");
  }
  event.target.parentNode.classList+= " active";
  let selelectedtab = event.target.innerHTML;
  let contenttab = document.getElementById('myTabContent');
  let contents = menuobject[selelectedtab];
  contenttab.innerHTML = "";
  for(key in contents){
    let newbutton = document.createElement('button');
    newbutton.className = "col-lg-2 col-md-2 col-xs-4 btn contentbtn";
    newbutton.innerHTML = key;
    newbutton.addEventListener('click',foodbtnclick);
    contenttab.appendChild(newbutton);
  }
}
//onchange  event for dropdownlist or quantitychange
function plateorquantitychange(event){
  let row = event.target.parentNode.parentNode;
  let fooditemname  = row.cells[0].innerHTML;
  let fooditemquantity = row.cells[2].firstChild.value;
  let oldprice = row.cells[3].innerHTML;
  if(fooditems[fooditemname].kind == 1 ){
    let fooditemplate = row.cells[1].firstChild.value;
    let fooditemprice = (parseInt(fooditemquantity) * parseInt(fooditems[fooditemname]["price"+fooditemplate]));
    row.cells[3].innerHTML = fooditemprice;
  }
  else{
    let fooditemprice = (parseInt(fooditemquantity) * parseInt(fooditems[fooditemname]["price"]));
    row.cells[3].innerHTML = fooditemprice;
  }
  let ttl = document.getElementById("total");
  ttl.innerHTML = parseInt(ttl.innerHTML) - parseInt(oldprice) + parseInt(row.cells[3].innerHTML);
}
//onclick event for food-items
function foodbtnclick(event){
  let fooditemname = event.target.innerHTML;
  let newrow = bill.insertRow(bill.rows.length-1);
  let newprice =null;
  newrow.className += "table-row";
  let newcell = newrow.insertCell(0);
  newcell.innerHTML = fooditemname;

  newcell = newrow.insertCell(1);
  let newdropdownlist = document.createElement('select');
  if(fooditems[fooditemname].kind == 1){
  let newoption = document.createElement('option');
  newoption.value = "half";
  newoption.innerHTML = "half";
  newdropdownlist.appendChild(newoption);
  newoption = document.createElement('option');
  newoption.value = "full";
  newoption.innerHTML = "full";
  newdropdownlist.appendChild(newoption);
  newdropdownlist.addEventListener('change', plateorquantitychange);
  newprice = fooditems[fooditemname].pricehalf;
  }
  else{
  newprice = fooditems[fooditemname].price;
  }
  newcell.appendChild(newdropdownlist);
  newcell = newrow.insertCell(2);
  let newnumberinput = document.createElement('input');
  newnumberinput.type = "number";
  newnumberinput.value = 1;
  newnumberinput.addEventListener('change' , plateorquantitychange);
  newcell.appendChild(newnumberinput);

  newcell = newrow.insertCell(3);
  newcell.innerHTML = newprice;

  newcell = newrow.insertCell(4);
  let removebtn = document.createElement('button');
  removebtn.className+=" btn";
  removebtn.addEventListener('click' , removeitemfrombill);
  removebtn.innerHTML = 'remove';
  newcell.appendChild(removebtn);

  let ttl = document.getElementById('total');
  ttl.innerHTML = parseInt(ttl.innerHTML) + parseInt(newprice);
}

function submitformfunction(event){
  event.preventDefault();
  // adding bill
  let elements = [];
  for(let i=0;i<(bill.rows.length-1);i++){
    let element = {};
    let row = bill.rows[i];
    element.name = row.cells[0].innerHTML;
    element.plate = row.cells[1].firstChild.value;
    element.quantity = row.cells[2].firstChild.value;
    element.price = row.cells[3].innerHTML;
    elements[i-1] = element
  }
  let exportbill ={}

  var today = new Date();

  exportbill.id = "bryc" + today.getDate() + " " + today.getHours()+ " " +today.getMonth() + " " + today.getMinutes() + " " +today.getFullYear()+ " " + today.getSeconds();
  exportbill.customerName = document.getElementById('customername').value;
  exportbill.contactinfo = document.getElementById('contactno').value;
  exportbill.elements = elements;
  exportbill.discount = document.getElementById('discount').value;
  exportbill.title = remote.getCurrentWindow().getTitle();
  dbb.bills.insert(exportbill , (err, records)=>{
    if(err){
      alert(err.messgae+"Error");
      return;
    }
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
    let transaction = {
      "type" : "large",
      "amount" : document.getElementById("total").innerHTML,
      "description" : "from bill" + exportbill.id
    }
    if(findflag == 1){
      dbds.dailysell.update({date:""+today.getDate()+today.getMonth()+today.getFullYear()}, newdailysell , (err,msg)=>{
        if(err){
          alert(err);
          return;
        }
        addtosafe(transaction);
      });
    }else {
      dbds.dailysell.insert(newdailysell , (err, msg)=>{
        if(err){
          alert("error submiting data to dailysell" + err);
          return;
        }
        addtosafe(transaction);
      })
    }
  })
})
}
// insert in largesafe and transaction

var addtosafe = (transaction)=>{
  dbsafes.safes.update({"type":"large"} , {$inc : {"amount" : parseInt(document.getElementById("total").innerHTML)}} , {upsert:true} , (err,msg)=>{
    if(err){
      alert(err);
      return;
    }
    dbtransactions.transactions.insert(transaction , (err,msg)=>{
      if(err){
        alert(err);
        return;
      }
      alert(msg);
      location.reload();
    })
  })
}
