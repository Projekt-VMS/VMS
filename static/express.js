
const express = require('express');
const app = express();
const PORT = 3000;
// Route für den Fall das ein GET-Request an '/' gesendet wird.
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(PORT, function(){
    console.log('Server running at port:'+PORT);
})