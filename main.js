const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/play', (req, res) => {
    res.render('play.ejs');
});

function sendFile(req, res) {
    res.sendFile(__dirname + req.url);
}

app.get('*.png', sendFile);
app.get('*.jpg', sendFile);
app.get('*.gif', sendFile);
app.get('*.css', sendFile);
app.get('*.js', sendFile);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});