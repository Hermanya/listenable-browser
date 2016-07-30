(function () {
    let listeners = []
    window.listenForUserInput = (commands, ...rest) => {
        if (commands) {
            listeners.push(command => {
                let fail = (command) => expressConfusion(command).then(() => listenForUserInput(commands))
                return (withHelp(commands)[command] || (() => fail(command))).apply('no context', rest)
            })
        } else {
            return new Promise(resolve => listeners.push(resolve))
        }
    }

    function expressConfusion (command) {
        return say(`Not sure what ${command || 'that'} means.`)
    }

    function withHelp (commands) {
        let commandNames = Object.keys(commands)
        let message
        if (commandNames.length === 0) {
            message = 'There are no commands.'
        } else if (commandNames.length === 1) {
            message = `You can only ${commandNames[0]}.`
        } else {
            message = `You can ask to ${commandNames.slice(0, -1).join(', ')}, and ${commandNames.slice(-1)[0]}.`
        }
        commands.help = () => say(message).then(() => listenForUserInput(commands))
        return commands
    }

    window.say = require('./how_to/say_something.js')

    require('electron').ipcRenderer.on('user-input', (event, input) => {
        let oldListeners = listeners
        listeners = []
        oldListeners.forEach(listener => listener(input))
    })
})()
