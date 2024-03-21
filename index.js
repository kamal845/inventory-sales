const express =require('express');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const connectDB=require("./database/database");
const middleware=require('./middleware/middleware');
const app=express();
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/',middleware);
const port= 3000;
try {
    app.listen(port, (req,res) => {
        connectDB().then(() => {
            console.log("Server is started on port no. 3000");
        }).catch(error => {
            console.log("Error connecting to the database:", error);
        });
    });
} catch (error) {
    console.log("Error:", error);
}