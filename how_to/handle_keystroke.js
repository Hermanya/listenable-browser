const {globalShortcut} = require('electron')
const say = require('./say_something.js')
const handle_user_input = require('./handle_user_input.js')

var current_input = ''

module.exports = function handle_keystroke (key) {
    say.no_more()
    return ({
        Escape: () => {
            globalShortcut.unregisterAll()
            require('./listen_for_user_to_focus.js')()
            say('you\'re off')
            current_input = ''
        },
        Space: () => {
            let last_word = current_input.split(' ').pop() || ''
            function listenable_silent_characters (word) {
                return word
                    .replace('~', ' tilde ')
                    .replace('`', ' backtick ')
                    .replace('!', ' exclamation mark ')
                    .replace('^', ' caret ')
                    .replace('(', ' opening parenthesis ')
                    .replace(')', ' closing parenthesis ')
                    .replace('-', ' minus ')
                    .replace('_', ' underscore ')
                    .replace(';', ' semicolon ')
                    .replace(':', ' colon ')
                    .replace('.', ' dot ')
                    .replace(',', ' coma ')
                    .replace('?', ' question mark ')
                    .replace('/', ' slash ')
            }
            say(listenable_silent_characters(last_word))
            current_input += ' '
        },
        Backspace: () => {
            let words = current_input.trim().split(' ')
            current_input = words.slice(0, -1).join(' ') + ' '
            let last_word = words.pop()
            if (last_word) {
                say(`scratched ${last_word}`)
            } else {
                say(`nothing to scratch`)
            }
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
