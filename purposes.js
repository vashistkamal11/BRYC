const electron = require("electron")
const mongojs = require("mongojs")

var PurposeBuilder = function(name){
  this.name = name;
}

var addPurpose = (purpose)=>{
  let dbpurposes = mongojs('127.0.0.1/purposes', ['purposes']);
  dbpurposes.purposes.find({"name": purpose.name} , (err,records)=>{
  if(err){
    alert(err);
    returnl
  }
  if(records.length == 0){
    dbpurposes.purposes.insert(purpose , (err,msg)=>{
      if(err){
        alert(err);
        return;
      }
      alert(msg);
    })
  }
  else{
    alert("record already exist");
  }
})
}

var removePurpose = (purpose)=>{
  let dbpurposes = mongojs('127.0.0.1/purposes' , ['purposes']);
  dbpurposes.purposes.remove({"name" : purpose} , (err,msg)=>{
    if(err){
      alert(err);
      return;
    }
    alert(msg);
  })
}
var createPurposeSource = (purposesource,callback)=>{
  let dbpurposes = mongojs('127.0.0.1/purposes' , ['purposes']);
  dbpurposes.purposes.find({} , (err , records)=>{
    if(err){
      alert(err);
      return;
    }
    purposesource = records.map(x => x.name);
    if(callback && typeof(callback)=="function")
    callback(purposesource);
  })
}

exports.PurposeBuilder = PurposeBuilder;
exports.addPurpose = addPurpose;
exports.removePurpose = removePurpose;
exports.createPurposeSource = createPurposeSource;
