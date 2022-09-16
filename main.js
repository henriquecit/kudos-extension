document.getElementById("submit").addEventListener("click", function () {
    // fazer o curl

    const message = document.querySelector('#message').value;
    const name = document.querySelector('#name').value;
    console.log('name: ', name)

    const headers = new Headers();
    headers.append("cache-control", "no-cache");
    headers.append("Content-Type", "application/json; charset=UTF-8");

    //let body = new URLSearchParams();
    //body.append(`{text: ${name} You rock: ${message}}`, "")
    var raw = JSON.stringify({
        "text": `${name} You rock: ${message}`
      });
    const requestOptions = {
        method: 'POST',
        headers,
        body: raw,
    }
    
    getWebhook().then(function(items) {
        fetch(items.webhook, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
    });

    
})

function getWebhook() {
    return chrome.storage.sync.get({
        webhook: ''
    })
}
