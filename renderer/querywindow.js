const mongojs = require("mongojs")

let dbds = mongojs('127.0.0.1/dailysell',['dailysell'])

document.getElementById('dailysellform').addEventListener('submit', (event)=>{
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
    let total = 0;
    for (i in records[0]){
      console.log(i);
    if(i != "_id" && typeof(records[0][i]) == 'object' ){
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let obj = records[0][i];
        console.log(obj)
        td1.innerHTML = i;
        td2.innerHTML = obj["quantity"];
        td3.innerHTML = obj["totalsold"];
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
      }
    }
  let th = document.createElement('tr');
  let td1 = document.createElement('th');
  let td2 = document.createElement('th');
  let td3 = document.createElement('th');
  td1.innerHTML = "Total";
  td3.innerHTML = records[0].totalsale;
  th.appendChild(td1);
  th.appendChild(td2);
  th.appendChild(td3);
  table.appendChild(th);
document.body.appendChild(table);
  })
})
