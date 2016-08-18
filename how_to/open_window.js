const {BrowserWindow, ipcMain} = require('electron')
const say = require('./say_something.js')
let open_websites = {}
var current_window

ipcMain.on('open-window', open_window)

module.exports = open_window
function open_window (maybe_event, url) {
    if (!url) {
        url = maybe_event
    }
    let host = (url.match('//([^/]+)/') || [url, url])[1]
    if (open_websites[host]) {
        current_window = open_websites[host]
    } else {
        current_window = open_websites[host] = new BrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: false,
                preload: `${__dirname}/../support_for_this_browser.js`
            }
        })
        current_window.url = url
        current_window.loadURL(url)
        current_window.webContents.on('did-fail-load', (event, error_code) => {
            let redirect = -3
            let something_triggered_by_loggin_out_out_of_sound_cloud = 0
            if (error_code !== redirect && error_code !== something_triggered_by_loggin_out_out_of_sound_cloud) {
                if (open_websites[host]) {
                //  open_websites[host].close() // TODO: figure out why it crashes the app:
                    if (current_window === open_websites[host]) {
                        current_window = undefined
                    }
                    open_websites[host] = undefined
                }
            }
        })
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
        return current_window.url
    }
}
