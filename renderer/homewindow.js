const electron = require('electron')
const ipc = electron.ipcRenderer
document.getElementById("options").style.padding = "100px 300px "


document.getElementById("newbill").addEventListener("click", (event)=>{
  ipc.send('newbillwindow')
})

document.getElementById("query").addEventListener("click",(event)=>{
  ipc.send('newquerywindow')
})

document.getElementById("menu").addEventListener("click" , (event)=>{
  ipc.send('newmenuwindow');
})
