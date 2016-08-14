const {BrowserWindow} = require('electron')
let open_websites = {}
var current_window

module.exports = function open_window (url) {
    if (open_websites[url]) {
        current_window = open_websites[url]
    } else {
        current_window = new BrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: false,
                preload: `${__dirname}/../support_for_this_browser.js`
            }
        })
        current_window.loadURL(url)
    }
}

module.exports.send = function send_to_open_window (...things) {
    if (current_window) {
        current_window.webContents.send(...things)
    }
}

module.exports.title = function open_window_title () {
    if (current_window) {
        return current_window.webContents.getTitle()
    }
}

module.exports.url = function open_window_url () {
    if (current_window) {
        return current_window.webContents.getURL()
    }
}
