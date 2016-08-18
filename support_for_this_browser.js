(function () {
    let handle_command = require('./how_to/handle_command.js')
    let listeners = []
    window.listenableBrowser = {
        listenForUserInput: (commands, options, ...rest) => {
            if (commands) {
                options = options || {}
                options.commands = commands
                options.try_again = () => {
                    listeners.push(input => {
                        handle_command(input, options, ...rest)
                    })
                }
                listeners.push(input => {
                    handle_command(input, options, ...rest)
                })
            } else {
                return new Promise(resolve => listeners.push(resolve))
            }
        },
        say: require('./how_to/say_something.js')
    }

    window.open = (url) => {
        // require('electron').ipcRenderer.send('open-window', url)
        location.href = url
    }

    require('electron').ipcRenderer.on('user-input', (event, input) => {
        let oldListeners = listeners
        listeners = []
        oldListeners.forEach(listener => listener(input))
    })

    try {
        require(`./what_would_client_be_like_for/${location.hostname}.js`)
    } catch (e) {
        // hope website supports listenableBrowser
    }
})()
