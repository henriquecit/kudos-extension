const icons = {
  youRock: {
    imageURL: 'https://i.imgur.com/T9xrcBy.png',
    value: 'You Rock!',
  },
  thankYou: {
    imageURL: 'https://i.imgur.com/JqIcb8e.png',
    value: 'Many Thanks!',
  },
  wellDone: {
    imageURL: 'https://i.imgur.com/oKAlQ0G.png',
    value: 'Well Done',
  },
  awesome: {
    imageURL: 'https://i.imgur.com/FIZIzls.png',
    value: 'Totally Awesome',
  },
  happy: {
    imageURL: 'https://i.imgur.com/DxXn360.png',
    value: 'Very Happy',
  },
  greatJob: {
    imageURL: 'https://i.imgur.com/9SflKJm.png',
    value: 'Great Job!',
  },
  congratulations: {
    imageURL: 'https://i.imgur.com/TassQG9.png',
    value: 'Congratulations!',
  },
};

const teamsSelectElement = document.getElementById('teamName');
const teamsMemberSelectElement = document.querySelector('#teamMembers');
let webhookURL;
let teams;
let yourName;

document.getElementById('submit').addEventListener('click', () => {
    const threadKey = getThreadKey(webhookURL);
    if (!threadKey) {
      return;
    }
    fetch(`${webhookURL}&threadKey=${threadKey}`, buildRequestOptions())
      .then((response) => response.text())
      .then(() => {
        alert('Your message has been sent!');
      })
      .catch((error) => {
        console.log('Error', error);
        alert('An error occurred');
      });
});

function getThreadKey(webhook) {
  try {
    return webhook.split('/spaces')[1].split('/messages')[0];
  } catch (error) {
    window.alert('Please make sure your webhook URL is valid and configured in the settings');
  }
}

document.getElementById('config-page').addEventListener('click', () => {
  open_configuration();
});

function buildRequestOptions() {
  const message = document.querySelector('#message').value;
  const name = document.querySelector('#teamMembers').value;
  const greetingValue = document.querySelector('#greeting').value;
  const { imageURL } = icons[greetingValue];
  const greetingText = icons[greetingValue].value;

  const headers = new Headers();
  headers.append('cache-control', 'no-cache');
  headers.append('Content-Type', 'application/json; charset=UTF-8');

  return {
    method: 'POST',
    headers,
    body: JSON.stringify({
      cards: [
        {
          header: {
            title: `<font color=\"#ff0000\">${greetingText}</font>`,
            imageUrl: imageURL,
            imageStyle: 'IMAGE',
          },

          sections: [
            {
              widgets: [{
                textParagraph: {
                  text: `To: <b>${name}</b> <br> From: <b>${yourName}</b>`,
                },
              }],
            },
            {
              header: 'Message:',
              widgets: [
                {
                  textParagraph: {
                    text: `${message} `,
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  };
}

getWebhook().then((items) => {
  const { teamsConfig } = items;
  const teamsOptions = Object.keys(teamsConfig).map((teamName) => `<option value=${teamName.replace(" ","_")}>${teamName}</option>`).join('\n');
  teamsSelectElement.innerHTML = teamsOptions;

  const { teamMembers } = teamsConfig[teamsSelectElement.value];
  teams = teamsConfig;
  yourName = items.nameUserConfig;
  updateTeamMembers(teamMembers)
});

function updateTeamMembers(teamMembers) {
  const options = teamMembers.map((teamMember) => `<option value=${teamMember.toLowerCase()}>${teamMember}</option>`).join('\n');
  teamsMemberSelectElement.innerHTML = options;
}

function changeTeam() {
  const team = getTeamName();
  const { teamMembers, webhook } = teams[team];
  webhookURL = webhook;
  updateTeamMembers(teamMembers);
}

function getTeamName() {
  return teamsSelectElement.value.replace("_", " ");
}

function open_configuration() {
  chrome.runtime.openOptionsPage ? chrome.runtime.openOptionsPage() : window.open(chrome.runtime.getURL('options.html'));
}

function getWebhook() {
  return chrome.storage.sync.get({
    nameUserConfig: '',
    teamsConfig: '',
  });
}

teamsSelectElement.addEventListener('change', changeTeam);
