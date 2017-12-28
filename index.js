const electron = require('electron')
const menu = require('./menu.js').menu
const ipc = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
let win
app.on('ready', ()=> {
    win  = new BrowserWindow();
    win.maximize();
    win.loadURL(`file://${__dirname}/view/homewindow.html`)
})

function newwindow(type, windowtitle){
  let window = new BrowserWindow({width:600,height:800,title:windowtitle})
  window.loadURL(`file://${__dirname}/view/${type}.html`)
}
// new window events
ipc.on('newbillwindow', (event, title)=>{
  newwindow("billwindow" , title);
})

ipc.on('newquerywindow',(event)=>{
  newwindow("querywindow");
})

ipc.on('newmenuwindow' , (event)=>{
  newwindow("menuwindow");
})
