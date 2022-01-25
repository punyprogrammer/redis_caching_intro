const express = require("express");
const redis = require("async-redis");
const axios=require("axios")
const util=require("util")
//create a redis a server
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
//promisify the redis methods

const app = express();
//middleware
app.use(express.json())
//routes

app.get("/posts/:id",async(req,res)=>{
    const {id}=req.params;
     //check the redis store
     const fromCache=await client.get(id);
     if(fromCache)
         {
             return res.status(200).json({message:"from_cache",data:JSON.parse(fromCache)})
         }
    const response=await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    //save the response in cache
    await client.set(id,JSON.stringify(response.data));
    res.status(200).json({message:"from_api",data:response.data})
})
app.listen(8080, async () => {
  
  console.log("The server is running on port 8080");
});
