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
    function previous () {
        document.querySelector('.skipControl__previous').click()
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
                    return wait_for(() => document.querySelector('.collection__likesSection .sc-button-play')).then(() => {
                        document.querySelector('.collection__likesSection .sc-button-play').click()
                        return wait_for_title_to_change().then(route)
                    })
                }
                obey()
            }
        }[location.pathname] || (() => {
            if (location.search === '?workaround_for_facebook_login') {
                document.querySelector('.loginButton').click()
                setTimeout(() => {
                    document.querySelector('.signinInitialStep_fbButton').click()
                    say('you are logged in, loading sound cloud').then(() => {location.href = '/'})
                }, 1000)
            } else {
                location.href = '/'
            }
        }))()
    }

    function obey () {
        let commands = {
            'play -something else': search,
            'what -is playing?': () => say(`it is ${current_title}`).then(obey),
            'how -long is it?': () => say(document.querySelector('.playbackTimeline__duration .sc-visuallyhidden').textContent).then(obey),
            'MediaPlayPause':  play_pause,
            'next':  next,
            'MediaNextTrack':  next,
            'previous':  previous,
            'MediaPreviousTrack':  previous
        }

        if (document.querySelector('[title="Pause current"]')) {
            commands['pause'] = play_pause
        } else {
            commands['play'] = play_pause
        }

        if (document.querySelector('.loginButton')) {
            commands['log in'] = () => ensure_logged_in().then(() => setTimeout(() => say('you are logged in').then(obey), 1000))
        } else {
            commands['log out'] = () => {
                document.querySelector('.header__moreButton').click()
                document.querySelector('[href="/logout"]').click()
                return say('you are logged out').then(obey)
            }
        }

        if (document.querySelector('.playControls [title="Like"]')) {
            commands['like'] = () => ensure_logged_in().then(() => {
                document.querySelector('.playControls [title="Like"]').click();
                return say('added to your favorite')
            }).then(obey)
        } else {
            commands['unlike'] = () => ensure_logged_in().then(() => {
                document.querySelector('.playControls [title="Unlike"]').click();
                return say('removed from your favorite')
            }).then(obey)
        }

        listen_for_user_input(commands)
    }

    function search (query) {
        current_title = undefined
        if (['likes', 'my likes', 'favorite', 'my favorite'].includes(query)) {
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

    function ensure_logged_in () {
        let login_button = document.querySelector('.loginButton')
        if (login_button) {
            return log_in()
        } else {
            return Promise.resolve()
        }
    }

    function log_in () {
        document.querySelector('.loginButton').click()
        return say('want to log in with facebook?').then(listen_for_user_input).then(input => {
            if (input.trim() === 'yes') {
                document.querySelector('.signinInitialStep_fbButton').click()
            } else {
                return say('only login with facebook is currently supported').then(() => {
                    obey()
                    return Promise.reject()
                })

                /* TODO: figure out why email cannot be injected by value */
                // return say('what is your email?').then(listen_for_user_input).then(continue_with_email)
                //
                // function continue_with_email (email) {
                //     document.querySelector('[name="username"]').value = email.trim().replace(/\s/g, '')
                //     document.querySelector('[title="Continue with email"]').click()
                //     let initial_page = '.signinForm__initial'
                //     let password_page = '.signinForm__signinWithPassword'
                //     let password_reset_page = '.signinForm__promptPasswordReset'
                //     return wait_for(() => {
                //         return document.querySelector(`${initial_page} .invalid`) || displayed(password_page)
                //
                //     }).then(() => {
                //         if (document.querySelector(`${initial_page}  .invalid`)) {
                //             document.querySelector(`${initial_page}  .invalid`).classList.remove('invalid')
                //             return say(document.querySelector(`${initial_page}  .textfield__validation`).textContent).then(listen_for_user_input).then(continue_with_email)
                //         } else if (displayed(password_page)) {
                //             return say('and password?').then(listen_for_user_input).then(continue_with_password)
                //
                //             function continue_with_password (password) {
                //                 document.querySelector(`${password_page} [type="password"]`).value = password.trim().replace(/\s/g, '')
                //                 document.querySelector(`${password_page} button`).click()
                //                 return wait_for(() => {
                //                     return document.querySelector(`${password_page} .invalid`) || !document.querySelector('.signinForm')
                //                 }).then(() => {
                //                     if (document.querySelector(`${password_page} .invalid`)) {
                //                         document.querySelector(`${password_page} .invalid`).classList.remove('invalid')
                //                         let message = document.querySelector(`${password_page} .textfield__validation`).textContent
                //                         if (message === 'This password is incorrect.') {
                //                             let captcha_required = displayed(`${password_page} .signinRecaptcha > .section`)
                //                             if (captcha_required) {
                //                                 return say('you seem locked out of your account, try loging in again later').then(() => {
                //                                     obey()
                //                                     return Promise.reject()
                //                                 })
                //                             }
                //                             return say(`${message}, did you forget your password?`).then(listen_for_user_input).then(answer => {
                //                                 if (answer === 'yes') {
                //                                     document.querySelector('.signinWithPassword__promptPassword').click()
                //                                     return wait_for(() => displayed(password_reset_page)).then(() => {
                //                                         document.querySelector(`${password_reset_page} [type="email"]`).value = email
                //                                         document.querySelector(`${password_reset_page} button`).click()
                //                                         return say('check your email').then(() => {
                //                                             obey()
                //                                             return Promise.reject()
                //                                         })
                //                                     })
                //                                 } else {
                //                                     return say(`ok, try entering password again`).then(listen_for_user_input).then(continue_with_password)
                //                                 }
                //                             }).then(continue_with_password)
                //                         } else {
                //                             return say(`${message}`).then(listen_for_user_input).then(continue_with_password)
                //                         }
                //                     } else {
                //                         return Promise.resolve()
                //                     }
                //                 })
                //             }
                //         } else {
                //             return say('this email is not registered, registration is currently not supported').then(obey)
                //         }
                //     })
                // }
                // function displayed (selector) {
                //     return window.getComputedStyle(document.querySelector(selector)).display === 'block'
                // }
            }
        })
    }
})
