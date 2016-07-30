const {BrowserWindow, app} = require('electron')
const say = require('./say_something.js')
var current_window

module.exports = function handle_user_input (input) {
    let words = input.split(' ')
    let pass_to_current_window = () => current_window && current_window.webContents.send('user-input', input)
    let strategy = {
        open () {
            let url = words.slice(1).join('')
            url = require('../bookmarks.json')[url] || url

            if (url.indexOf('http://') !== '0') {
                url = `http://${url}`
            }
            if (current_window) {
                current_window.destroy()
            }
            current_window = new BrowserWindow({
                show: false,
                webPreferences: {
                    nodeIntegration: false,
                    preload: `${__dirname}/../support_for_this_browser.js`
                }
            })
            current_window.loadURL(url)
        },
        quit () {
            return say('quitting browser').then(app.quit)
        }
    }[words[0]] || pass_to_current_window
    return strategy()
}
