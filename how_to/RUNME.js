const {app, globalShortcut} = require('electron')
const hijack_keyboard = require('./hijack_keyboard.js')
app.on('ready',  () => {
    hijack_keyboard()
})
app.on('will-quit', () => globalShortcut.unregisterAll())
app.on('window-all-closed', event => event.preventDefault())
