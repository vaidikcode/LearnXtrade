import express from 'express'
import cors from 'cors'
import connectDB from './db/db.js';
import dotenv from 'dotenv'
import http from 'http'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true
}));

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

connectDB()
.then((result) => {
    app.on("error", (err)=>{
        console.log(err)
        throw err
    })
    app.listen(process.env.PORT, ()=>{
        console.log("Server is listening on port ", process.env.PORT)
    })
})
.catch((err)=>{
    console.log(`DB connection error : ${err}`)
})



