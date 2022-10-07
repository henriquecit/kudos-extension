document.getElementById("submit").addEventListener("click", function () {

    getWebhook().then(function(items) {
        const threadKey = items.webhook.split('/spaces')[1].split('/messages')[0];
        fetch(`${items.webhook}&threadKey=${threadKey}`, buildRequestOptions(items))
        .then(response => response.text())
        .then(() => {
            alert('Your message has been sent!')
        })
        .catch(error => {
            console.log('Error', error)
            alert('An error occurred')
        })
    });    
})

document.getElementById("config-page").addEventListener("click", function () {
  open_configuration()
})

function buildRequestOptions({nameUserConfig}) {
    const message = document.querySelector('#message').value;
    const name = document.querySelector('#name').value;
    const greeting = document.querySelector('#greeting').value;

    const headers = new Headers();
    headers.append("cache-control", "no-cache");
    headers.append("Content-Type", "application/json; charset=UTF-8");

    return {
        method: 'POST',
        headers,
        body: JSON.stringify({
            "cards": [
              {
                "header": {
                  "title": `<font color=\"#ff0000\">${greeting}</font>`,
                  "imageUrl": "https://goo.gl/aeDtrS",
                  "imageStyle": "IMAGE"
                },

                "sections": [
                    {
                        "widgets": [{
                            "textParagraph": {
                                "text": `To: <b>${name}</b> <br> From: <b>${nameUserConfig}</b>`
                            }
                        }]
                    },
                  {
                    "header": "Message:",
                    "widgets": [
                      {
                        "textParagraph": {
                          "text": `${message} `
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }),
    }
}

function open_configuration() {
  chrome.runtime.openOptionsPage ? chrome.runtime.openOptionsPage() : window.open(chrome.runtime.getURL("options.html"))
}

function getWebhook() {
    return chrome.storage.sync.get({
        webhook: '',
        nameUserConfig: ''
    })
}
