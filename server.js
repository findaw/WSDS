const express = require('express');
const app = express();
const clientDir = "./client";
const fs = require("fs");

app.use(express.json());    //to read request body
app.use(express.static("client"));
app.get('/', (req, res)=>{
    console.log(req);
    fs.readFile("./client/view/index.html", (err, data)=>{
        console.log(data);
        res.type('.html').status(200).send(data).end();
    });

    
});
app.get('/category', (req, res)=>{
    console.log(req);
    fs.readFile("./client/view/category.html", (err, data)=>{
        console.log(data);
        res.type('.html').status(200).send(data).end();
    });

    
});

app.get('/write', (req, res)=>{
    console.log(req);
    fs.readFile("./client/view/write.html", (err, data)=>{
        console.log(data);
        res.type('.html').status(200).send(data).end();
    });

    
});

app.listen(3000, ()=> console.log("listening on 3000 port"));





