import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"

import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";

import rateLimiter from "./middleware/rateLimiter.js";




dotenv.config();
const app=express();

if(process.env.NODE_ENV !== "production"){
app.use(cors({
    origin:"http://localhost:5173"
}));

}


const PORT=process.env.PORT ||5001;
const __dirname=path.resolve()
//middleware
app.use(express.json());//this middleware will parse JSON bodies: req.body
//our simple custom middleware
app.use(rateLimiter);


//  app.use((req,res,next)=>{
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`)
//     next();
// })

app.use("/api/notes",notesRoutes);

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
})
}

// app.get("/api/notes",(req,res)=>{
//     // del
//     res.status(200).send("you are 5");
// });

// app.post('/api/notes',(req,res)=>{
//     req.status(200).json({message:"Note created sucessfuly"})
// });
// app.put("/api/notes/:id",(req,res)=>
// {
//     res.status(200).json({message:"Note updated sucessfuly!"})
// })
 
// app.delete("/api/notes/:id",(req,res)=>{
//     res.status(200).json({message:"Note deleted sucessfuly"})
// })

connectDB().then(()=>{
    app.listen(PORT,()=>
{
    console.log("Server started on PORT:",PORT); 
})

});
