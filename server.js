const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

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
    fs.readFile("./client/app/readdir.html", (err, data)=>{
        res.type('.html').status(200).send(data).end();
    });

    
});
app.post("/readdir/file", (req, res)=>{
    console.log(req.files);
    const form = formidable.IncomingForm();
    form.multiples = true;
    
    form.uploadDir = path.join(__dirname + "/tmp");
    form.parse(req, (err, fields, files)=>{
     
        

         Object.keys(files).forEach(key=>{
            console.log(key);
            console.log(files[key].path);

            let uploadPath = path.join(__dirname + "/upload");
            console.log(key.split("/"));
            
            key.split("/").forEach(data=>{
                //존재하지않는 디렉토리인지 (조건:디렉토리명은 .(점)이 없다가정)
                uploadPath = path.join(uploadPath + "/" + data);
            
                if(data.trim() !=="" && !/[a-zA-Z]+\.[a-zA-Z]+$/.test(data) && !fs.existsSync(uploadPath)){                    
                    console.log("생성" + uploadPath);
                    fs.mkdirSync(uploadPath);
                }
            });

            fs.renameSync(files[key].path, "./upload" + key);
         });

        res.status(200).send("확인");
    });
})

app.listen(4000, ()=> console.log("listening on 4000 port"));





