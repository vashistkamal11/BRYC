const electron = require('electron')
const menu = require('./menu.js').menu
const ipc = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
let win
app.on('ready', ()=> {
    win  = new BrowserWindow({width:1200, height:800})
    win.loadURL(`file://${__dirname}/view/homewindow.html`)
})

function newwindow(type){
  let window = new BrowserWindow({width:600,height:800})
  window.loadURL(`file://${__dirname}/view/${type}.html`)
}
// new window events
ipc.on('newbillwindow', ()=>{
  let bill = "billwindow"
  newwindow(bill);
})

ipc.on('newquerywindow',()=>{
  newwindow("querywindow");
})

ipc.on('newmenuwindow' , ()=>{
  newwindow("menuwindow");
})
