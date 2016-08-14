const say = require('./say_something.js')

module.exports = (input, {commands, try_again, after_help, if_not_recognized}, ...rest) => {
    let fail = (command) => express_confusion(command).then(try_again)
    let unrecognized = if_not_recognized || fail
    return match(input, with_help(commands))()

    function match (input, commands) {
        let commandNames = Object.keys(commands).sort((one, another) => one.length < another.length ? 1 : -1)
        let found = commandNames.find(name => {
            let word = name.split('-')[0]
            return input.match(new RegExp(`^${word}`, 'i'));
        })
        if (found) {
            let param = input.slice(found.split('-')[0].length)
            return () => commands[found](param)
        } else {
            return () => unrecognized(input)
        }
    }

    function express_confusion (command) {
        return say(`Not sure what ${command || 'that'} means.`)
    }

    function with_help (commands) {
        let commandNames = Object.keys(commands)
        let message
        if (commandNames.length === 0) {
            message = 'There are no commands.'
        } else if (commandNames.length === 1) {
            message = `You can only ${commandNames[0]}.`
        } else {
            message = `You can ask to ${commandNames.slice(0, -1).join(', ')}, and ${commandNames.slice(-1)[0]}.`
        }
        commands.help = () => say(message)
            .then(after_help || (() => Promise.resolve()))
            .then(try_again || (() => Promise.resolve()))
        return commands
    }
}
