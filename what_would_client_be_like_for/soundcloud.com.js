// TODO: like, login
window.addEventListener('load', () => {
    let {say, listenForUserInput: listen_for_user_input} = window.listenableBrowser
    let current_title;

    let is_playing = false;
    function play_pause () {
        if (is_playing) {
            document.querySelector('[title="Pause current"]').click()
        } else {
            document.querySelector('[title="Play current"]').click()
        }
        is_playing = !is_playing
        obey()
    }

    function next () {
        document.querySelector('.skipControl__next').click()
        wait_for_title_to_change().then(route)
    }

    route()

    function route () {
        return ({
            '/': () => say(`What do you wanna listen to?`).then(listen_for_user_input).then(search),
            '/stream': () => say(`What do you wanna listen to?`).then(listen_for_user_input).then(search),
            '/search/sounds': () => {
                if (!current_title) {
                    is_playing = true
                    if (document.querySelector('.searchList__empty')) {
                        return say('nothing found, what else do you wanna listen to?').then(listen_for_user_input).then(search)
                    }
                    return wait_for(() => document.querySelector('.search .sc-button-play')).then(() => {
                        document.querySelector('.search .sc-button-play').click()
                        return wait_for_title_to_change().then(route)
                    })
                }
                obey()
            },
            '/you/likes': () => {
                if (!current_title) {
                    is_playing = true
                    if (document.querySelector('.searchList__empty')) {
                        return say('nothing found, what else do you wanna listen to?').then(listen_for_user_input).then(search)
                    }
                    return wait_for(() => document.querySelector('.search .sc-button-play')).then(() => {
                        document.querySelector('.l-main .sc-button-play').click()
                        return wait_for_title_to_change().then(route)
                    })
                }
                obey()
            }
        }[location.pathname] || (() => {location.href = '/'}))()
    }

    function obey () {
        listen_for_user_input({
            'play -something else': search,
            'what -is playing': () => say(`it is ${current_title}`).then(obey),
            'how -long is it': () => say(document.querySelector('.playbackTimeline__duration .sc-visuallyhidden').textContent).then(obey),
            'play':  play_pause,
            'MediaPlayPause':  play_pause,
            'pause': play_pause,
            'next':  next,
            'MediaNextTrack':  next
        })
    }

    function search (query) {
        current_title = undefined
        if (['likes', 'favorite'].includes(query)) {
            location.href = '/you/likes'
        } else {
            location.href = `/search/sounds?q=${query}`
        }
    }

    function wait_for_title_to_change () {
        return wait_for(() => {
            let element = document.querySelector('.playbackSoundBadge__title [aria-hidden="true"]')
            if (element && element.textContent !== current_title) {
                current_title = element.textContent
                return true;
            } else {
                return false;
            }
        })
    }
    function wait_for (condition_to_be_true) {
        return new Promise(resolve => {
            wait()
            function wait () {
                window.setTimeout(() => {
                    if (condition_to_be_true()) {
                        resolve()
                    } else {
                        wait()
                    }
                }, 100)
            }
        })
    }
})
