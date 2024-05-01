chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'simplify') {
        var legalText = request.text;
        var serverUrl = 'https://simplifytext-ia6ervzfwa-uc.a.run.app/simplifyText';

        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: legalText }),
        })
            .then(response => response.json())
            .then(data => {
                var simplifiedText = data.simplifiedText;
                sendResponse({ simplifiedText: simplifiedText });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ simplifiedText: 'An error occurred while simplifying the text.' });
            });

        return true;
    }
});