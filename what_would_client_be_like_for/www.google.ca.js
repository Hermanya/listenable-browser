window.onload = function() {
    let results = Array.from(document.querySelectorAll('.srg .g')).map(element => {
        return {
            link: element.querySelector('h3 a').href,
            title: element.querySelector('h3 a').textContent,
            description: element.querySelector('.st').textContent
        }
    })
    doItem(0)

    function doItem (index) {
        if (index === results.length) {
            say('last one is').then(doItem(index - 1))
        }
        say(results[index].title).then(obey)
        function obey () {
            listenForUserInput({
                '': () => doItem(index + 1),
                'proceed': () => doItem(index + 1),
                'elaborate': () => say(results[index].description).then(obey)
                'open': () => location.href = results[index].link
            })
        }
    }
};
