// Saves options to chrome.storage
function save_options() {
    const webhook = document.getElementById('config').value;
    const nameUserConfig = document.getElementById('nameUserConfig').value;
    chrome.storage.sync.set({
      webhook: webhook,
      nameUserConfig: nameUserConfig
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
  function add_member() {
    const list = document.getElementById('teamMemberList');
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder ='Enter team member name';

    list.appendChild(input);
  }

  function save_members() {
    const list = document.getElementById('teamMemberList');

    list.childNodes.forEach(childElement => {
        if(childElement.type === 'text') {
          console.log(childElement) 
        }
      }
    )
  }

  function restore_options() {
    chrome.storage.sync.get({
      webhook: '',
      nameUserConfig: ''
    }, function(items) {
      document.getElementById('config').value = items.webhook;
      document.getElementById('nameUserConfig').value = items.nameUserConfig;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);
  document.getElementById('add').addEventListener('click', add_member);
