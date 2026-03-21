const formData = {
    access_key: '54fe71c4-5d8c-44c2-bf89-7480ebf42b85',
    name: 'Test Name',
    email: 'kushagra7642@gmail.com',
    message: 'Testing Web3Forms API connection.',
    subject: 'New Portfolio Message!'
};

fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
})
.then(res => res.text())
.then(data => {
    console.log('Status:', 'OK');
    console.log('Response length:', data.length);
    console.log('Response start:', data.substring(0, 200));
})
.catch(err => console.error('Error:', err));
