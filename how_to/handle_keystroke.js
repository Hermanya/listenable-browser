const {globalShortcut} = require('electron')
const say = require('./say_something.js')
const handle_user_input = require('./handle_user_input.js')

var current_input = ''

module.exports = function handle_keystroke (key) {
    return ({
        Escape: () => {
            globalShortcut.unregisterAll()
            require('./listen_for_user_to_focus.js')()
            say('you\'re out')
            current_input = ''
        },
        Space: () => {
            say(current_input.split(' ').pop())
            current_input += ' '
        },
        Backspace: () => {
            let words = current_input.trim().split(' ')
            current_input = words.slice(0, -1).join(' ') + ' '
            say(`scratched ${words.pop()}`)
        },
        Enter: () => {
            handle_user_input(current_input.trim())
            current_input = ''
        }
    }[key] || (() => {
        if (key.indexOf('Shift+') === 0) {
            current_input += key.split('').pop().toUpperCase()
        } else if (key === 'Plus') {
            current_input += '+'
        } else {
            current_input += key.toLowerCase()
        }
    }))()
}
