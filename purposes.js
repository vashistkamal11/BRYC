const electron = require("electron")
const mongojs = require("mongojs")

var PurposeBuilder = (name)=>{
  this.name = name;
}

var addPurpose = (purpose)=>{
  let dbpurposes = mongojs['127.0.0.1/purposes', ['purposes']];
  dbpurposes.purposes.insert(purpose , (err,msg)=>{
    if(err){
      alert(err);
      return;
    }
    alert(msg);
  })
}

exports.PurposeBuilder = PurposeBuilder;
exports.addPurpose = addPurpose;
