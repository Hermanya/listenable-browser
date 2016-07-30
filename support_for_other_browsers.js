if (window.say === undefined) {
    window.say = something => new Promise(resolve => {
        let utterance = new SpeechSynthesisUtterance(something)
        utterance.addEventListener('end', resolve)
        setTimeout(() => speechSynthesis.speak(utterance), 0)
    })
}
if (window.listenForUserInput === undefined) {

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

    let currentInput = ''
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keypress', onKeyPress);
    function onKeyPress (event) {
        let character = String.fromCharCode(event.which)
        if (character === ' ') {
            say(currentInput.split(' ').pop())
        }
        currentInput += character
    }
    function onKeyDown (event) {
        if(event.keyCode == 8){
            event.preventDefault();
            let words = currentInput.trim().split(' ')
            currentInput = words.slice(0, -1).join(' ') + ' '
            say(`scratched ${words.pop()}`)
        } else if (event.keyCode == 13) {
            let oldListeners = listeners
            listeners = []
            oldListeners.forEach(listener => listener(currentInput.trim()))
            currentInput = ''
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
}
