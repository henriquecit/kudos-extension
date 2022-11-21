// Saves options to chrome.storage
function save_options() {
    const webhook = document.getElementById('config').value;
    const nameUserConfig = document.getElementById('nameUserConfig').value;
    const teamMembers = getTeamMembers();

    chrome.storage.sync.set({
      webhook: webhook,
      nameUserConfig: nameUserConfig,
      teamMembers: teamMembers
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  //adds a new team member
  function add_member(name) {
    const list = document.getElementById('teamMemberList');
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder ='Enter team member name';
    if (name) {
      input.value = name;
    }
    list.appendChild(input);
  }

  function getTeamMembers() {
    const list = document.getElementById('teamMemberList');
    let teamMembers = [];

    list.childNodes.forEach(childElement => {
        if(childElement.type === 'text' && childElement.value) {
          teamMembers.push(childElement.value) 
        }
      }
    )
    
    return teamMembers;
  }

  function restore_options() {
    chrome.storage.sync.get({
      webhook: '',
      nameUserConfig: '',
      teamMembers: null
    }, function(items) {
      document.getElementById('config').value = items.webhook;
      document.getElementById('nameUserConfig').value = items.nameUserConfig;
      if (items.teamMembers) {
        items.teamMembers.forEach(member => {
          add_member(member);
        })
      } 
    });
  }

  function exportSettings() {
    chrome.storage.sync.get({
      webhook: '',
      nameUserConfig: '',
      teamMembers: null
    }, function(items) {
      console.log(items);
      var a = document.createElement('a');
      a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(items)));
      a.setAttribute('download', 'kudosapp.json');
      a.click();
    });
  }

  function importSettings(e) {
    const file = e.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function(e) { 
        var newconfig = e.target.result;
        console.log(newconfig);

        chrome.storage.sync.set(JSON.parse(newconfig), function() {
          // Update status to let user know options were saved.
          var status = document.getElementById('status');
          status.textContent = 'Options saved.';
          setTimeout(function() {
            //forcing reload to get uploaded settings
            document.location.reload(true);
          }, 750);
        });


      }
      reader.readAsText(file);
    } else { 
      alert('An unexpected error occoured while loading the file.');
    }
  }

  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);
  document.getElementById('add').addEventListener('click', add_member);
  document.getElementById('export').addEventListener('click', exportSettings);
  document.getElementById('import').addEventListener('change', importSettings);