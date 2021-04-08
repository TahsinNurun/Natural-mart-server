const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { ObjectID } = require('bson');
require('dotenv').config()


const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const port = 5000;

app.get('/', (req,res) => {
    res.send('hello from db it is working')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbvce.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const vegetablesCollection = client.db("naturalMart").collection("vegetables");
    const ordersCollection = client.db("naturalMart").collection("orderSummary");
    console.log('database connected');
    
// showing all vegetables from database code

    app.post('/vegetables', (req, res) => {
        const data = req.body;
        // console.log(data);
        vegetablesCollection.insertOne(data)
            .then((documents) =>{
                // console.log(documents);
                res.send(documents);
            })
    })

  app.get('/vegetables',(req,res) =>{
        vegetablesCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    // order storing to database code

    app.post('/orderSummary', (req,res) =>{
        const newCheckOut = req.body;
        ordersCollection.insertOne(newCheckOut)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
        console.log(newCheckOut);
    })

// code for showing specific user order list

    app.get('/orders', (req,res) => {
        ordersCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    // single product info showing  code

    app.get('/vegetables/:id',(req,res) =>{
        vegetablesCollection.find({_id:ObjectId(req.params.id)})
        .toArray( (err, documents) => {
            // console.log(documents[0]);
            res.send(documents[0]);
        })
    })

    app.get('vegetablesByIds',(req, res)=>{
        
        const vegetableIds = req.body;
        vegetablesCollection.find({id: {$in: vegetableIds}})
        .toArray((err,documents) => {
            res.send(documents);

        })
    })

    
});


app.listen(process.env.PORT || port )