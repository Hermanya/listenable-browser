(function() {
    let {say, listenForUserInput: listen_for_user_input} = window.listenableBrowser

    function compose (tweet) {
        localStorage['__draft_tweets__:global'] = JSON.stringify(tweet)
    }

    function obey () {
        listen_for_user_input({
            'tweet (something)': compose
        })
    }

    document.querySelector('#global-new-tweet-button')
    document.querySelector('.tweet-btn')

}());
