const {app, BrowserWindow} = require('electron')
const menu = require('./menu.js').menu
let win
app.on('ready', ()=> {
    console.log(menu.item56)
    win  = new BrowserWindow({width:600, height:800})
    win.loadURL(`file://${__dirname}/view/index.html`)
})
