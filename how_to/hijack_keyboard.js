const {globalShortcut} = require('electron')
const say = require('./say_something.js')
const handle_keystroke = require('./handle_keystroke.js')

const range = size => Array(size).join('-').split('-').map((_, i) => i)
const keys = [
    ...range(127 - 33).map(x => String.fromCharCode(x + 33)).filter(x => x !== '+'),
    ...range(26).map(x => 'Shift+' + String.fromCharCode(65 + x)),
    'Plus',
    'Space',
    'Backspace',
    'Enter',
    'Escape'
]

const open_window = require('./open_window.js')

module.exports = function hijack_keyboard () {
    say(`you are on ${open_window.title() || 'the browser'}`)
    keys.map(key => globalShortcut.register(key, () => handle_keystroke(key)))
}
