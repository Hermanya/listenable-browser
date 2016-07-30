const {app, globalShortcut, BrowserWindow} = require('electron')
const {focus_shortcut} = require('../package.json').config
const listen_for_user_to_focus = require('./listen_for_user_to_focus.js')

app.on('ready', listen_for_user_to_focus)
app.on('will-quit', () => {
    globalShortcut.unregister(focus_shortcut);
    globalShortcut.unregisterAll();
})
