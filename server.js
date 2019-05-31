const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path");

app.set("view engine", "ejs");
//app.set("views", path.join(__dirname, "client/dynamic"));

app.use(express.json());    //to read request body
app.use(express.static("client/public"));



app.use("/category", require("./routes/categoryRoute"));
app.use("/write", require("./routes/writeRoute"));
app.use("/login", require("./routes/loginRoute"));


app.get('/', (req, res)=>{
    console.log(req);
    
    res.render("index");

    
});


app.get('/readdir', (req, res)=>{
    fs.readFile("./client/view/readdir.html", (err, data)=>{
        res.type('.html').status(200).send(data).end();
    });

    
});

app.listen(4000, ()=> console.log("listening on 3000 port"));





