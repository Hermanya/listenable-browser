const {globalShortcut} = require('electron')
const say = require('./say_something.js')
const handle_user_input = require('./handle_user_input.js')
const player = require('play-sound')()

var current_input = ''

var deactivation_timeout;
function deactivate_browser () {
    clearTimeout(deactivation_timeout)
    globalShortcut.unregisterAll()
    require('./listen_for_user_to_focus.js')()

    player.play(__dirname + '/../what_you_hear/when_locked.mp3')
    current_input = ''
}

module.exports = function handle_keystroke (key) {
    clearTimeout(deactivation_timeout)
    deactivation_timeout = setTimeout(deactivate_browser, 10000)
    say.no_more()
    return ({
        Escape: deactivate_browser,
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
                say(`Scratched ${last_word}`)
            } else {
                say(`Nothing to scratch.`)
            }
        },
        Enter: () => {
            handle_user_input(current_input.trim())
            current_input = ''
        }
    }[key] || (() => {
        if (key.indexOf('Shift+') === 0) {
            current_input += key.split('').pop().toUpperCase()
        } else if (['MediaNextTrack', 'MediaPreviousTrack', 'MediaStop', 'MediaPlayPause'].includes(key)) {
            handle_user_input(key)
        } else if (key === 'Plus') {
            current_input += '+'
        } else {
            current_input += key.toLowerCase()
        }
    }))()
}
