// Saves options to chrome.storage
function save_options() {
    var webhook = document.getElementById('config').value;
    chrome.storage.sync.set({
      webhook: webhook,
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  function restore_options() {
    chrome.storage.sync.get({
      webhook: '',
    }, function(items) {
      document.getElementById('config').value = items.webhook;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);