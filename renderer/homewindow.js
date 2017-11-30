const electron = require('electron')
const ipc = electron.ipcRenderer
document.getElementById("options").style.padding = "300px 300px "


document.getElementById("newbill").addEventListener("click", (event)=>{
  ipc.send('newbillwindow')
})

document.getElementById("query").addEventListener("click",(event)=>{
  console.log('kamal')
  ipc.send('newquerywindow')
})
