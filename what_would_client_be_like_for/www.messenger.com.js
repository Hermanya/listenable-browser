window.onload = function() {
    let {say, listenForUserInput: listen_for_user_input} = window.listenableBrowser
    let chats = Array.from(document.querySelectorAll('[role="rowheader"]')).map(element => {
        return {
            element,
            id: element.id.split(':')[1],
            type: element.id.split(':')[0].split('_').pop(),
            name: element.querySelector('._1ht6').textContent
        }
    })
    let active_chat = chats[0]

    let switch_profile_screen = document.querySelector('._5hy9')
    if (switch_profile_screen) {
        switch_profile_screen.click()
    }
    if (document.querySelector('#login_form')) {
        login()
    } else {
        obey()
        setInterval(check_for_new_messages, 4096)
    }

    function obey () {
        listen_for_user_input({
            'chat with (someone)': (someone) => select_chat(someone).then(obey),
            'chat': () => say('with who?').then(listen_for_user_input).then(select_chat).then(obey),
            'logout': () => {
                document.querySelector('[aria-label="Settings, privacy policy, help and more"]').click()
                Array.from(document.querySelectorAll('._54nc')).pop().click()
            }
        }, {
            if_not_recognized: (message) => send(message).then(() => say('sent')).then(obey)
        })
    }

    function login () {
        say('you are not logged in, what is your username?').then(listen_for_user_input).then(username => {
            document.querySelector('[name="email"]').value = username.split(' ').join('')
            return say('and password?').then(listen_for_user_input)
        }).then(password => {
            document.querySelector('[name="pass"]').value = password.split(' ').join('')
            document.querySelector('[name="persistent"]').click()
            document.querySelector('[name="login"]').click()
        })
    }

    function send (message) {
        document.querySelector('[aria-label="New Message"]').click()
        setTimeout(() => {
            localStorage[`_cs_${active_chat.type}:${active_chat.id}`] = JSON.stringify({
                "__t": Date.now(),
                "__v": {
                    "encodedBlocks": {
                        "blocks": [
                            {
                                "key": Date.now(),
                                "type": 0,
                                "text": message,
                                "depth": 0,
                                "inlineStyleRanges": [],
                                "entityRanges": []
                            }
                        ],
                        "entityMap": {}
                    }

                }
            })
            document.querySelector(`[id="row_header_id_${active_chat.type}:${active_chat.id}"] a`).click()
            setTimeout(() => document.querySelector('[title="Press Enter to send"]').click(), 1)
        }, 1);
        return Promise.resolve()
    }

    function select_chat (name) {
        let chat = chats.find(chat => chat.name.match(new RegExp(name, 'i')))
        if (chat) {
            active_chat = chat
            return say('selected')
        } else {
            return say(`no chat called ${name}`)
        }
    }

    function check_for_new_messages () {
        chats.forEach(chat => {
            let has_new_message = chat.element.parentElement.classList.contains('_1ht3')
            let message = chat.element.querySelector('._1htf').textContent
            if (has_new_message && message !== chat.last_message) {
                chat.last_message = message
                let has_sender = message !== chat.element.querySelector('._1htf span').textContent
                if (has_sender) {
                    let sender = message.split(':')[0]
                    say(`${sender} says: ${message.split(':').slice(1).join(':')}`)
                } else {
                    say(`${chat.name} says: ${message}`)
                }
                mark_as_read(chat)
            }
        })
    }

    function mark_as_read (chat) {
        // TODO: figure out a way; js events do not do that;
    }
};
