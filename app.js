const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from NodeJS CI/CD with Jenkins!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
