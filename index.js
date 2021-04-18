
const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId; 
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port = process.env.PORT || 6060
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqi99.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello World! ddddddghh')
})





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("eventmanagement").collection("customerBooking");
  const reviewCollection = client.db("eventmanagement").collection("customerReview");
  const serviceCollection = client.db("eventmanagement").collection("services");
  
  const adminCollection = client.db("eventmanagement").collection("admininfo");
  // perform actions on the collection object
 
   app.post('/addbooking',(req,res)=>{
      const bookInfo = req.body
      bookingCollection.insertOne(bookInfo)
      .then(result=>{
          res.send(result.insertedCount>0)
      })       
   })

  app.post('/addreview',(req,res)=>{
    const reviewInfo = req.body
    reviewCollection.insertOne(reviewInfo)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })

  app.get('/orders',(req,res)=>{
    bookingCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
      //console.log(documents)
    })
  })

  app.delete('/deleteservice/:id',(req,res)=>{
    console.log(req.params.id)
    const id = new ObjectId.ObjectID(req.params.id)
    console.log('delete this',id)
   serviceCollection.findOneAndDelete({_id:id})
    .then(documents=>{res.send(documents)})
  }) 

  app.patch('/updateorder/:id',(req,res)=>{
    const id = new ObjectId.ObjectID(req.params.id)
    bookingCollection.updateOne({_id:id},
      
      {
        $set :{status:req.body.status}
      }
      )
      .then(result=>{
        console.log(result)
      })
    
  })

  app.get('/reviews',(req,res)=>{
    reviewCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
      //console.log(documents)
    })
  })


  app.get('/services',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
      //console.log(documents)
    })
  })


  app.post('/addservice',(req,res)=>{
    const serviceInfo = req.body
   //console.log(serviceInfo)
    serviceCollection.insertOne(serviceInfo)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })

  app.post('/addadmin',(req,res)=>{
    const adminInfo = req.body
   console.log(adminInfo)
    adminCollection.insertOne(adminInfo)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
    
  })
app.get ('/admins',(req,res)=>{
  adminCollection.find({})
  .toArray((err,documents)=>{
    res.send(documents)
    //console.log(documents)
  })
})





});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
