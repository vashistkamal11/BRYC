const electron = require("electron")
const ipc = electron.ipcRenderer
const mongojs = require("mongojs")

var  FoodItemBuilder = function(kind  , name , price , category , inventory){
  this.kind = kind;
  if(kind == 1){
    this.name = name;
    this.pricehalf = price[0];
    this.pricefull = price[1];
    this.inventory = inventory;
    this.category = category;
  }
  else{
  this.name = name;
  this.price = price;
  this.inventory = inventory;
  this.category = category;
  }
}

var getFoodItems = function(foodItems, callback){
  let dbmenu = mongojs('127.0.0.1/menu', ['menu']);
  dbmenu.menu.find({},(err,records)=>{
    if(err){
      alert(err);
      return;
    }
    for(i=0;i<records.length;i++){
      foodItems[records[i].name] = records[i];
    }
    if(callback && typeof(callback) == "function"){
    callback(foodItems);
  }
  })
}

var menuBuilder = function(menuobject , callback){
  let dbmenu = mongojs('127.0.0.1/menu', ['menu']);
  dbmenu.menu.find({}, (err , records)=>{
    if(err){
      alert("error message is \n"+ err);
      return;
    }
     for(let i=0;i<records.length;i++){
       if(menuobject[records[i].category]){
         menuobject[records[i].category][records[i].name] = records[i].price;
       }
       else{
         menuobject[records[i].category] = {};
         menuobject[records[i].category][records[i].name] = records[i].price;
       }
     }
      if(callback &&  typeof(callback) == "function"){
        callback(menuobject);
      }
  });
  return menuobject;
}

var addFoodItem = (fooditem , callback)=>{
  let dbmenu = mongojs('127.0.0.1/menu', ['menu']);
  dbmenu.menu.find({"name" : fooditem.name} , (err, records)=>{
    if(err){
      console.log(err);
      return;
    }
    else{
      console.log("inside");
      if(records.length>0){
        console.log("found");
        dbmenu.menu.remove({"name":fooditem.name}, (err)=>{
          if(err){
            alert(err);
            return;
          }
          console.log("removed");
          dbmenu.menu.insert(fooditem, (err,msg)=>{
            if(err){
              alert(err);
              return;
            }
            console.log("inserted"+msg)
          });
        })
      }
      else{
        dbmenu.menu.insert(fooditem, (err,msg)=>{
          if(err){
            alert(err);
            return;
          }
          alert("inserted"+msg)
        });
      }
    }
    if(callback && typeof(callback) == "function"){
      callback(fooditem);
    }
  })
}

var removeFoodItem = (fooditem,callback)=>{
  let dbmenu = mongojs('127.0.0.1/menu', ['menu']);
  dbmenu.menu.remove({"name":fooditem}, (err, msg)=>{
    if(err){
      alert(err);
      return;
    }
    else {
      alert("removed" + msg);
    }
    if(callback && typeof(callback) == "function"){
      callback(fooditem);
    }
  })
}
exports.FoodItemBuilder = FoodItemBuilder;
exports.removeFoodItem = removeFoodItem;
exports.addFoodItem = addFoodItem;
exports.menuBuilder = menuBuilder;
exports.getFoodItems = getFoodItems;
