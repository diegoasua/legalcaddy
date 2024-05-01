document.addEventListener('DOMContentLoaded', function () {
    var simplifiedTextDiv = document.getElementById('simplifiedText');
    var loadingDiv = document.querySelector('.loading');

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: getSelectedText
        }, function (results) {
            var selectedText = results[0].result;
            loadingDiv.style.display = 'block'; // Show the loading animation
            chrome.runtime.sendMessage({ action: 'simplify', text: selectedText }, function (response) {
                simplifiedTextDiv.innerText = response.simplifiedText;
                loadingDiv.style.display = 'none'; // Hide the loading animation
            });
        });
    });
});

function getSelectedText() {
    return window.getSelection().toString().trim();
}
