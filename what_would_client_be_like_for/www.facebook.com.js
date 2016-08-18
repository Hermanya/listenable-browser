window.addEventListener('load', () => {
    let {say, listenForUserInput: listen_for_user_input} = window.listenableBrowser
    let routes = {
        '/login.php': () => {
            let title = document.querySelector('#content').textContent.split('.')[0]
            return say(`${title}. What is your email or phone?`).then(listen_for_user_input).then(username => {
                document.querySelector('[name="email"]').value = username.split(' ').join('')
                return say('and password?').then(listen_for_user_input)
            }).then(password => {
                document.querySelector('[name="pass"]').value = password.split(' ').join('')
                document.querySelector('[name="login"]').click()
            })
        },
        '/v2.0/dialog/oauth': () => {
            location.href = decodeURIComponent(decodeURIComponent(location.search.match(/redirect_uri=([^&]+)/)[1]).match(/origin=([^&]+)/)[1]) + '?workaround_for_facebook_login'
        }
    }
    let route_unhandled = () => say(`facebook ${location.pathname} is not handled`)
    let strategy = routes[location.pathname] || route_unhandled
    strategy()
})
