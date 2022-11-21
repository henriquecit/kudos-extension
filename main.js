document.getElementById("submit").addEventListener("click", function () {
    getWebhook().then(function(items) {
        const threadKey = getThreadKey(items.webhook);
        if (!threadKey) {
          return;
        }
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

function getThreadKey(webhook) {
  try {
    return webhook.split('/spaces')[1].split('/messages')[0];
  } catch(error) {
    window.alert("Please make sure your webhook URL is valid and configured in the settings");
  }
}

document.getElementById("config-page").addEventListener("click", function () {
  open_configuration()
})

function buildRequestOptions({nameUserConfig}) {
    const message = document.querySelector('#message').value;
    const name = document.querySelector('#teamMembers').value;
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

getWebhook().then(items => {
  const { teamMembers } = items;
  const select = document.querySelector('#teamMembers');

  let options = teamMembers.map(teamMember => `<option value=${teamMember.toLowerCase()}>${teamMember}</option>`).join('\n');
  select.innerHTML = options;
})

function open_configuration() {
  chrome.runtime.openOptionsPage ? chrome.runtime.openOptionsPage() : window.open(chrome.runtime.getURL("options.html"))
}

function getWebhook() {
    return chrome.storage.sync.get({
        webhook: '',
        nameUserConfig: '',
        teamMembers: ''
    })
}
