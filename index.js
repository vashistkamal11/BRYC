const electron = require('electron')
const menu = require('./menu.js').menu
const ipc = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
let win
app.on('ready', ()=> {
    win  = new BrowserWindow({width:600, height:800})
    win.loadURL(`file://${__dirname}/view/index.html`)
})

ipc.on('display', function(event, arg=[]){
  console.log(arg)
})
