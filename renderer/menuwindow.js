const electron = require("electron")
const ipc = electron.ipcRenderer
const mongojs = require("mongojs")
const menufunctions = require('./../menu.js')

$(document).ready(function() {
  let today = new Date();
  console.log(today.getTime());
  console.log(today.getDate());
  fooditemstable = document.getElementById('food-items');
  dbmenu = mongojs('127.0.0.1/menu', ['menu']);
  foodItems = {};
  menufunctions.getFoodItems(foodItems , createfoodItemTable);

  $("#additem").click((e)=>{
    e.preventDefault();
    $("#additemdialog").modal("show");
  });

  $("#kind1").click((e)=>{
    e.preventDefault();
    $("#additemdialog").modal("hide");
    $("#additemdialogkind1").modal("show");
  });

  $("#kind2").click((e)=>{
    e.preventDefault();
    $("#additemdialog").modal("hide");
    $("#additemdialogkind2").modal("show");
  });

  $("#savekind1").click(saveKind1);
  $("#savekind2").click(saveKind2);
})
//for creating table based on available food items
var createfoodItemTable = function (foodItemsList){
  for(key in foodItemsList){
    let newrow = fooditemstable.insertRow(fooditemstable.rows.length);
    let newcell = newrow.insertCell(0);
    newcell.innerHTML = key;
    newcell = newrow.insertCell(1);
    newcell.innerHTML = foodItemsList[key].category;
    newcell = newrow.insertCell(2);
    if(foodItemsList[key].kind == 1){
      newcell.innerHTML = "["+foodItemsList[key].pricehalf + "," + foodItemsList[key].pricefull + "]";
    }
    else{
      newcell.innerHTML = foodItemsList[key].price;
    }
    newcell = newrow.insertCell(3);
    let newbutton = document.createElement('button');
    newbutton.id = "remove";
    newbutton.className = "btn";
    newbutton.innerHTML = "remove item";
    newbutton.addEventListener('click' , remove);
    newcell.appendChild(newbutton);
  }
}
//for removing food item
var remove = (e)=>{
  e.preventDefault();
  let name = e.target.parentNode.parentNode.firstChild.innerHTML;
  menufunctions.removeFoodItem(name , ()=>{
    location.reload();
  });

}
// for adding food item to database
var saveKind1 = (e)=>{
  console.log("kamal");
  e.preventDefault();
  let name = document.getElementById("fooditemnamekind1").value;
  let category = document.getElementById("categorykind1").value;
  let pricehalf = document.getElementById("pricehalf").value;
  let pricefull = document.getElementById("pricefull").value;
  $("#additemdialogkind1").modal("hide");
  menufunctions.addFoodItem(new menufunctions.FoodItemBuilder(1 , name , [pricehalf,pricefull] , category), ()=>{
    location.reload();
  });
}

var saveKind2 = (e)=>{
  e.preventDefault();
  let name = document.getElementById("fooditemnamekind2").value;
  let category = document.getElementById("categorykind2").value;
  let price = document.getElementById("price").value;
  $("#additemdialogkind2").modal("hide");
  menufunctions.addFoodItem(new menufunctions.FoodItemBuilder(2, name , price , category) , ()=>{
    location.reload();
  });
}
