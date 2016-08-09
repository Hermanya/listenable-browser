
window.addEventListener('load', () => {
    let {say, listenForUserInput: listen_for_user_input} = window.listenableBrowser
    let current_title;

    route()

    function route () {
        return ({
            '/': () => say(`What would you like to hear?`).then(listen_for_user_input).then(search),
            '/results': () => {
                document.querySelector('a[href^="/watch"]:not([aria-hidden])').click(); route()
            },
            '/watch': () => {
                if (!current_title) {
                    return wait_for_title_to_change().then(route)
                }

                let obey = () => listen_for_user_input({
                    'play (something else)': that_something => search(that_something),
                    'play':  () => { document.querySelector('[aria-label="Play"]').click(); obey() },
                    'pause': () => { document.querySelector('[aria-label="Pause"]').click(); obey() },
                    'next':  () => { document.querySelector('.autoplay-bar').querySelector('a[href^="/watch"]:not([aria-hidden])').click(); wait_for_title_to_change().then(route) }
                })

                say(`playing ${current_title}`).then(obey)
            }
        }[location.pathname] || (() => {location.href = '/'}))()
    }

    function search (query) {
        let videos_only = 'sp=EgIQAQ%253D%253D'
        location.href = `https://www.youtube.com/results?q=${query}&${videos_only}`
    }

    function wait_for_title_to_change () {
        return new Promise(resolve => {
            wait()
            function wait () {
                window.setTimeout(() => {
                    let element = document.querySelector('.watch-title')
                    if (element && element.title !== current_title) {
                        current_title = element.title
                        resolve()
                    } else {
                        wait()
                    }
                }, 100)
            }
        })
    }
})
