const electron = require("electron")
const ipc = electron.ipcRenderer
const mongojs = require("mongojs")

var  UserBuilder = function(name , id , password ,level){
  this.name = name;
  this.id = id;
  this.password = password;
  this.level = level;
}

var addUser = function(user){
  let dbusers = mongojs['127.0.0.01/users' , ['users']];
  dbusers.users.find({"id" : user.id} , (err,records)=>{
    if(err){
      alert(err);
      return;
    }
    if(records.length == 0 ){
      dbusers.insert(user , (err , msg)=>{
        if(err){
          alert(err);
          return;
        }
        else{
          alert(msg);
        }
      });
    }
    else{
      alert("userid already exists");
    }
  })
}
