const say_util = require('say')

module.exports = function say (something, with_voice, and_speed) {
    if (!something) {
        return Promise.resolve()
    }
    return new Promise(then_continue => {
        say_util.speak(something, with_voice, and_speed, then_continue)
    })
}

module.exports.no_more = function stop_speaking () {
    say_util.stop()
}
