const https = require("https")
const fs = require('fs');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const User_router = require('./routes/User-router')
require('./config/config(db)');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
// app.get('/', (req, res) => {

//     res.send('Hello World!')

//     res.setHeader('X-Foo', 'bar')

// })
const options = {
    key: fs.readFileSync('selfsigned.key', 'utf8'),
    cert: fs.readFileSync('selfsigned.crt', 'utf8')
}


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/frontend')));

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname + '/frontend', 'index.html'));
});
app.use("/api/users", User_router);
// var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);
httpsServer.listen(port);
// app.listen(port, () => console.log("server started at 5000"));
// https.createServer(options, app).listen(port, console.log(`server runs on port ${port}`))