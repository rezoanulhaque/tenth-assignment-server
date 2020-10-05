const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3yghf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
    const worksCollection = client.db("tenthAssignment").collection("volunteerWorks");
    const volunteerProfileCollection = client.db("tenthAssignment").collection("volunteerProfile");
       app.post('/addVolunteerWork', (req, res) => {
           const product = req.body;
           worksCollection.insertOne(product)
           .then(result => {
               res.send(result.insertedCount>0)
           })
       })
       app.get('/workdetails', (req, res) => {
        worksCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    }) 
    app.post('/volunteerProfile', (req, res) => {
        const profile = req.body;
        volunteerProfileCollection.insertOne(profile)
        .then(result => {
            res.send(result.insertedCount>0)
        })
    })
    app.get('/volunteerdetails', (req, res) => {
        volunteerProfileCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    }) 
    app.get('/volunteerdetailsadmin', (req, res) => {
        volunteerProfileCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    app.delete('/delete/:id', (req, res)=>{
        volunteerProfileCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result=>{
            res.send(result.insertedCount>0)
        })
    })   
  });
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(port);