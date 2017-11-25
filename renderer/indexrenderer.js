const electron = require("electron")
const ipc = electron.ipcRenderer
const menu = require('./../menu.js').menu

let bill = document.getElementById('bill');
let warningflag = 0;

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

additem.addEventListener('submit', function(event){

    event.preventDefault();

    let cnt = 0;
    let elem = document.getElementById('additem').elements

    let newrow = bill.insertRow(bill.rows.length);
    let values =[]
    let valuesref =[]
    for(let i=0;i<elem.length;i+=1){
        let tmp = elem[i];
        if(tmp.type === "number" || tmp.type === "text"){
          values[cnt] = tmp.value;
          valuesref[cnt]=tmp
          cnt+=1;
        }
    }
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
    for(let i=1;i<bill.rows.length;i++){
      row = bill.rows[i]
      for(let j=0;j<row.cells.length;j++){
        if(j==0){
        cell = row.cells[j]
        ncell = row.cells[j+1]
        if((cell.innerHTML == menu["item"+values[0]].name) && ((ncell.innerHTML == "Half" && values[2]=="h")||(ncell.innerHTML == "Full" && values[2]=="f")||(ncell.innerHTML=="----"))){

          let quantity = row.cells[2];
          let price = row.cells[3];
          row.cells[2].innerHTML = parseInt(row.cells[2].innerHTML) + parseInt(values[1]);
          row.cells[3].innerHTML = row.cells[2].innerHTML*(menu["item"+values[0]]["price" + values[2]]);
          return;
        }
      }
    }
  }
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

    btnclose = document.createElement("button")
    btnclose.innerHTML = "remove"
    newcell = newrow.insertCell(4);
    newcell.appendChild(btnclose)

    for(let i=0;i<valuesref.length;i+=1)
      valuesref[i].value = null

    let warn = document.getElementById('warning')
    warn.parentNode.removeChild(warn)
    warningflag = 0;
})
