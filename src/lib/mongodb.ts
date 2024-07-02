import { MongoClient,ServerApiVersion  } from 'mongodb';

declare const global: {
    _mongoClientPromise: Promise<MongoClient> | undefined; 
};

const uri = process.env.MONGODB_URI as string;
const options = {};

// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
//   async function run() {
//     try {
//       // Connect the client to the server	(optional starting in v4.7)
//       await client.connect();
//       // Send a ping to confirm a successful connection
//       await client.db("campaign-db").command({ ping: 1 });
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
//   run().catch(console.dir);

//   const clientPromise = client;

//   export default clientPromise

let client;
let clientPromise: Promise<MongoClient> = global._mongoClientPromise!;
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        
        // clientPromise = client.connect();
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    
    clientPromise = client.connect();
}

export default clientPromise;