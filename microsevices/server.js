// Get dependencies 
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// Get our API routes 
const api = require('./server/routes/api');
const app = express();
// Parsers for POST data 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Point static path to dist 
app.use(express.static(path.join(__dirname, 'dist')));
// Set our API routes 
app.use('/api', api);
// Catch all other routes and return the index file 
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'dist/index.html')); });
// Get port from environment and store in Express 
const port = process.env.PORT || '3000'; app.set('port', port);
// Create HTTP server 
const server = http.createServer(app);

// Connect to the products database 
var db
MongoClient.connect('mongodb://test1:testone1@ds233895.mlab.com:33895/testone',
    { useNewUrlParser: true }, (err, database) => {
        if (err) return console.log(err)
        db = database.db('testone');
    })
    
/**  api for /quotes to write to the MongoDB at mlab.com */
app.get('/products', (req, res) => {
    db.collection('products').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})

/**   * Listen on provided port, on all network interfaces.   */
server.listen(port, "0.0.0.0", () => console.log(`API running on localhost:${port}`)); 