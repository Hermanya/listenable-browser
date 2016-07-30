const {globalShortcut} = require('electron')
const hijack_keyboard = require('./hijack_keyboard.js')
const {focus_shortcut} = require('../package.json').config

module.exports = function listen_for_user_to_focus () {
    globalShortcut.register(focus_shortcut, hijack_keyboard)
}
