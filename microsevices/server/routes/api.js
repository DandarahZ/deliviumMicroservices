const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const ObjectId = require('mongodb').ObjectID;
const BCRYPT_SALT_ROUNDS = 12;

const API = 'https://jsonplaceholder.typicode.com';
const cors = require ('cors');
router.use(cors());

router.get('/', (req, res) => {
    res.send('Api Works!');
});

var db;

//set up connection to MONGODB
MongoClient.connect('mongodb://test1:testone1@ds233895.mlab.com:33895/testone',
    { useNewUrlParser: true }, (err, database) => {
        if (err) return console.log(err)
        db = database.db('testone');
    });

//authenticate user
router.get('/authuser/:username/:password', (req, res2) => {
    let username = req.params.username;
    let password = req.params.password;
    db.collection('users').findOne({ "name": username },
        { password: 1, role: 1, _id: 0 }, function (err, result) {
            bcrypt.compare(password, result.password, function (err, res) {
                if (res) {
                    res2.send([{ "auth": true, "role": result.role }]);
                }
                else { res2.send([{ "auth": false }]); }
            });
        });
});


//register user
router.get('/reguser/:name/:password/:role', (req, res) => {
    bcrypt.hash(req.params.password, BCRYPT_SALT_ROUNDS, function (err, hash) {
        db.collection('users').save({
            "name": req.params.name, "password":
                hash, "role": req.params.role
        }, (err, result) => {

        });
    });
})



// USERS CRUD
router.get('/users', (req, res) => {
    db.collection('users').find().toArray((err, results) => {
        res.send(results)
    });
});
router.post('/users/add', (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, function (err, res) {

        if (name && password) {

            const user = {
                name,
                password
            };

            db.collection("users").insertOne(user, (err, results) => {
                res.send(results);
            });
        }
        else {
            res.send('please put in all parameters');
        }
    })
});
router.delete('/users/delete/:id', (req, res) => {

    const myquery = { _id: ObjectId(req.params.id) };
    db.collection("users").deleteOne(myquery, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});
router.put('/users/update/:id', (req, res) => {
    bcrypt.hash(password, result.password, BCRYPT_SALT_ROUNDS, function (err, res) {
        const { name, password } = req.body;
        const { id } = req.params;
        if (name && password) {

            const myquery = { _id: ObjectId(req.params.id) };
            const newvalues = {
                $set: {
                    name,
                    password
                }
            };
            db.collection("users").updateOne(myquery, newvalues, (err, response) => {
                if (err) throw err;
                res.send(response);
            });

        }
        else {
            res.send('please provide parameters');
        }
    })
});



// PRODUCTS CRUD
router.get('/products', (req, res) => {
    db.collection('products').find().toArray((err, results) => {
        res.send(results)
    });
});
router.post('/products/add', (req, res) => {
    const { name, brand, description, price } = req.body;

    if (name && brand && description && price) {

        const product = {
            name,
            brand,
            description,
            price,
            image: "NOTHING"
        };

        db.collection("products").insertOne(product, (err, results) => {
            res.send(results);
        });
    }
    else {
        res.send('please put in all parameters');
    }

});
router.delete('/products/delete/:id', (req, res) => {
    console.log(req.params.id);

    const myquery = { _id: ObjectId(req.params.id) };
    db.collection("products").deleteOne(myquery, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});
router.put('/products/update/:id', (req, res) => {
    const { name, brand, description, price } = req.body;
    const { id } = req.params;
    if (name && brand && description && price) {

        const myquery = { _id: ObjectId(req.params.id) };
        const newvalues = {
            $set: {
                name,
                brand,
                description,
                price
            }
        };
        db.collection("products").updateOne(myquery, newvalues, (err, response) => {
            if (err) throw err;
            res.send(response);
        });

    }
    else {
        res.send('please provide parameters');
    }
});


// REVIEWS CRUD
router.get('/reviews', (req, res) => {
    db.collection('reviews').find().toArray((err, results) => {
        res.send(results)
    });
});

router.post('/reviews/add', (req, res) => {
    const { nickname, comment } = req.body;

    if (nickname && comment) {

        const review = {
            nickname,
            comment
        };

        db.collection("reviews").insertOne(review, (err, results) => {
            res.send(results);
        });
    }
    else {
        res.send('please put in all parameters');
    }
});

router.delete('/reviews/delete/:id', (req, res) => {
    console.log(req.params.id);

    const myquery = { _id: ObjectId(req.params.id) };
    db.collection("reviews").deleteOne(myquery, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});
router.put('/reviews/update/:id', (req, res) => {
    const { nickname, comment } = req.body;
    const { id } = req.params;
    if (nickname && comment) {

        const myquery = { _id: ObjectId(req.params.id) };
        const newvalues = {
            $set: {
                nickname,
                comment
            }
        };
        db.collection("reviews").updateOne(myquery, newvalues, (err, response) => {
            if (err) throw err;
            res.send(response);
        });

    }
    else {
        res.send('please provide parameters');
    }
});

module.exports = router;