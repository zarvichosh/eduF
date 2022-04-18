var express = require('express');
var edufinder = express();
var dotenv = require('dotenv'); 
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
dotenv.config();
var MongoUrl = "mongodb+srv://victor:08035905421@cluster0.wrm6i.mongodb.net/EduFinder?retryWrites=true&w=majority";
var cors = require('cors')
const bodyParser = require('body-parser');
var  port = process.env.PORT || 2000;
var db;

edufinder.use(bodyParser.urlencoded({extended:true}));
edufinder.use(bodyParser.json());
edufinder.use(cors());


edufinder.get('/',(req,res)=>{
    res.send("Welcome To Edufinder")
})

edufinder.get('/allschools',(req,res) => {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={"id":Number(req.query.id)}
    }
    //return all schools wrt category 1//
    else if(req.query.category1){
        var category = (req.query.category1)
        query={"category_1_id":Number(req.query.category1)}
    }
    //return all schools wrt star rating//
    else if(req.query.stars){
        var stars = (req.query.stars)
        query={"star_rating_id":Number(req.query.stars)}
    }
    else if(req.query.lstar && req.query.hstar){
        var lstar = Number(req.query.lstar);
        var hstar = Number(req.query.hstar);
        query = {$and:[{stars:{$gt:gstar,$lt:lstar}}]}
    }
    // Delete schools from schools database
    edufinder.delete('/delschools',(req,res)=>{
        db.collection('schools').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
    // Post schools to schools database
    edufinder.post('/joinus',(req,res)=>{
        console.log(req.body);
        db.collection('schools').insert(req.body,(err,result) => {
            if(err) throw err;
            res.send("You've been successfully added")
        })
    })
})
    edufinder.put('/updateStatus/:id',(req,res) => {
        var id = Number(req.params.id);
        var status = req.body.status?req.body.status:"Confirmed"
        db.collection('schools').updateOne(
            {schools:id},
            {
                $set:{
                    Name:req.body.Name,
                    Category:req.body.Category,
                    School_Fees:req.body.School_Fees,
                    Facility:req.body.Facility
                }
            }
        )
        res.send('data updated'(result))
    })

db.collection('schools').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
    })
})

MongoClient.connect(MongoUrl,(err,client) => {
    if(err) console.log("error while connecting");
    db = client.db('EduFinder');
    edufinder.listen(port,()=>{
        console.log(`view new RestAPI on localhost:${port} on your web browser`)
    })
})

