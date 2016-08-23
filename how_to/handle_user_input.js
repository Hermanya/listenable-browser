const {app, clipboard} = require('electron')
const say = require('./say_something.js')
const open_window = require('./open_window.js')
const handle_command = require('./handle_command.js')

module.exports = function handle_user_input (input) {
    return handle_command(input, {
        commands: {
            'open -a website': url => {
                url = url.split(' ').join('')
                url = require('../bookmarks.json')[url] || url
                if (url.indexOf('http://') !== 0) {
                    url = `http://${url}`
                }
                open_window(url)
            },
            'copy link': () => {
                clipboard.writeText(open_window.url())
                return say('link copied')
            },
            quit: () => {
                return say('quitting browser').then(app.quit)
            }
        },
        if_not_recognized: () => {open_window.send('user-input', input)},
        after_help: () => open_window.send('user-input', 'help'),
        try_again: () => {}
    })
}
