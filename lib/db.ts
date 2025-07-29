import mongoose from "mongoose";
const MONGODB_URI=process.env.MONGODB_URI
if(!MONGODB_URI){
    throw new Error("Please define mongo_uri in env")
}

let cached = global.mongoose

if(!cached){
    cached=global.mongoose={conn:null,promise:null}
}

export async function connectDB(){
    if(cached.conn){
        return cached.conn
    }
    
    if(!cached.promise){

        mongoose.connect(MONGODB_URI).then(()=> mongoose.connection)
    }
    try{
        cached.conn = await cached.promise
    }
    catch{
        cached.promise = null
        throw new Error("Failed to connect to MongoDB")
    }
    return cached.conn
}