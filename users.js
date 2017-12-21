const electron = require("electron")
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
var removeUser = function(id  , name){
let dbusers = mongojs['127.0.0.1/users' , ['users']];
  if(id){
    dbusers.users.remove({"id":id});
  }
  else if(name){
    dbusers.users.remove({"name":name});
  }
}

var changePassword = function(id , oldpassword , newpassword){
  let dbusers = mongojs['127.0.0.1/users' , ['users']];
  dbusers.users.find({"id":id}, (err , records)=>{
    if(err){
      alert(err);
      return;
    }
    if(records.length == 0){
      alert("no user with given id");
      return;
    }
    if(records[0].password == oldpassword){
      dbusers.users.update({"id":id}, {$set : {"password": newpassword}} , (err, msg)=>{
        if(err){
          alert(err);
          retutn;
        }
        alert(msg);
      })
    }
  })
}
exports.addUser = addUser;
exports.removeUser = removeUser;
exports.UserBuilder = UserBuilder;
exports.changePassword = changePassword;
