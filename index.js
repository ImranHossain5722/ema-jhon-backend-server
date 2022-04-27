const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware
app.use(cors());
app.use(express.json());

// db connected 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmc6z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
            await client.connect();
            const productsCollection = client.db('emajhon').collection('product')

            app.get('/product', async(req,res)=>{
              console.log('query', req.query);
                const page = parseInt(req.query.page);
                const size = parseInt(req.query.size);
                const query = {}
                const cursor = productsCollection.find(query)
                
                let products;
                if (page || size){

                  products = await cursor.skip(page*size).limit(size).toArray()

                }
                else{

                    const products = await cursor.toArray()
                   
                }
                res.send(products)
            })

              // product data total count  function
            app.get('/productCount',async(req,res)=>{
              const query ={}
              const cursor =productsCollection.find(query)
              const count = await productsCollection.estimatedDocumentCount() ;
              res.send({count})
            })


            //use post to get 
            app.post ('/productByKeys', async(req, res )=>{

              const keys = req.body;
              const ids = keys.map(id => ObjectId (id))
              const query = {_id: {$in: ids} }
              const cursor = productsCollection.find(query)
              const products = await cursor.toArray();
              res.send(products)

            })

    }
    finally{

    }

}
run().catch(console.dir)




app.get("/", (req, res) => {
  res.send("Jhon is running and waiting");
});

app.listen(port, () => {
  console.log("ema jhon is running on ", port);
});
