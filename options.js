let teams = {};
const teamsSelectElement = document.getElementById('teams');
const webHookElement = document.getElementById('config');
const userNameElement = document.getElementById('nameUserConfig');
const teamMemberListElement = document.getElementById('teamMemberList');

// Saves options to chrome.storage
function save_options() {
  const nameUserConfig = userNameElement.value;

  chrome.storage.sync.set({
    nameUserConfig,
    teamsConfig: teams,
  }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

// adds a new team member
function add_member(name) {
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('teamMemberInput');
  input.placeholder = 'Enter team member name';
  input.addEventListener('focusout', onFocusLeaveSaveEverything)
  if (name && typeof name === 'string') {
    input.value = name;
  }
  teamMemberListElement.appendChild(input);
}

//create team if it does not exist
function createTeam() {
  const teamName = document.getElementById('teamName').value;
  if (!teamName) {
    alert('Please add a value on team name');
    return;
  }
  if (!teams[teamName]) {
    teams[teamName] = {};
  }
  updateTeamsSelect();
}

function getTeamName() {
  return teamsSelectElement.value.replace("_", " ");
}

function changeTeam() {
  const team = getTeamName();
  const { teamMembers, webhook } = teams[team];
  webHookElement.value = webhook || '';
  clearTeamMembersInputs();
  updateTeamMembers(teamMembers);
}

function updateTeamsSelect() {
  const teamsNames = Object.keys(teams);
  const options = teamsNames.map((teamName) => `<option value=${teamName.replace(" ","_")}>${teamName}</option>`).join('\n');
  teamsSelectElement.innerHTML = options;
}

function updateTeamMembers(teamMembers) {
  if (!teamMembers) {
    add_member();
    return;
  }
  teamMembers.forEach(teamMember => {
    add_member(teamMember);
  })
}

function clearTeamMembersInputs() {
  const inputs = document.querySelectorAll('.teamMemberInput');
  inputs.forEach(input => {
    input.remove();
  })
}

function getTeamMembers() {
  const list = document.getElementById('teamMemberList');
  const teamMembers = [];

  list.childNodes.forEach((childElement) => {
    if (childElement.type === 'text' && childElement.value) {
      teamMembers.push(childElement.value);
    }
  });

  return teamMembers;
}

function restore_options() {
  chrome.storage.sync.get({
    teamsConfig: null,
    nameUserConfig: ''
  }, (items) => {
    teams = items.teamsConfig;    
    updateTeamsSelect();
    const teamName = getTeamName();
    const { teamMembers, webhook } = teams[teamName]
    userNameElement.value = items.nameUserConfig;
    webHookElement.value = webhook;
    if (teamMembers) {
      teamMembers.forEach((member) => {
        add_member(member);
      });
    }
  });
}

function exportSettings() {
  chrome.storage.sync.get({
    nameUserConfig: '',
    teamsConfig: null,
  }, (items) => {
    const a = document.createElement('a');
    a.setAttribute('href', `data:text/plain;charset=utf-u,${encodeURIComponent(JSON.stringify(items))}`);
    a.setAttribute('download', 'kudosapp.json');
    a.click();
  });
}

function importSettings(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const newconfig = e.target.result;
      console.log(newconfig);

      chrome.storage.sync.set(JSON.parse(newconfig), () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          // forcing reload to get uploaded settings
          document.location.reload(true);
        }, 750);
      });
    };
    reader.readAsText(file);
  } else {
    alert('An unexpected error occoured while loading the file.');
  }
}

function onFocusLeaveSaveEverything(event) {
  const webhook = webHookElement.value;
  const teamMembers = getTeamMembers();
  const teamName = getTeamName();
  teams[teamName].webhook = webhook;
  teams[teamName].teamMembers = teamMembers;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener(
  'click',
  save_options,
);
document.getElementById('add').addEventListener('click', add_member);
document.getElementById('export').addEventListener('click', exportSettings);
document.getElementById('import').addEventListener('change', importSettings);
document.getElementById('createTeamButton').addEventListener('click', createTeam);
document.getElementById('teams').addEventListener('change', changeTeam);
webHookElement.addEventListener('focusout', onFocusLeaveSaveEverything)