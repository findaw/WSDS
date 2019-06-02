const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const PORT = process.env.PORT || 4000;
app.set("view engine", "ejs");
//app.set("views", path.join(__dirname, "client/dynamic"));

app.use(express.json());    //to read request body
app.use(express.static("client/public"));

app.use("/category", require("./routes/categoryRoute"));
app.use("/write", require("./routes/writeRoute"));
app.use("/login", require("./routes/loginRoute"));



app.get('/', (req, res)=>{
    res.render("index");
});
app.get('/', (req, res)=>{
    res.render("index");
});

app.get('/readdir', (req, res)=>{
    fs.readFile("./client/app/readdir.html", (err, data)=>{
        res.type('.html').status(200).send(data).end();
    });
});

app.get("/view", (req, res)=>{
    fs.readFile("tmp/entry.bin", (err, files)=>{
        console.log(files)
        res.render("view.ejs", {rootName : "public", entry: files});
    });
})

app.post("/readdir/file", (req, res)=>{
    const form = formidable.IncomingForm();
    form.uploadDir = path.join(__dirname + "/tmp");
    form.parse(req, (err, fields, files)=>{
        console.log(fields);
        /*
        fs.writeFile("./tmp/entry.bin", fields.entry, (err)=>{
            console.log("엔트리");
        });
         Object.keys(files).forEach(key=>{
            //console.log(key);   console.log(files[key].path);
            console.log(files[key].type);
            console.log(files[key].name);
            let uploadPath = path.join(__dirname + "/upload");
            console.log(key.split("/"));

            key.split("/").forEach(data=>{

                uploadPath = path.join(uploadPath + "/" + data);
                //존재하지않는 디렉토리인지 (조건:디렉토리명은 .(점)이 없다가정)
                if(data.trim() !=="" && !/[a-zA-Z]+\.[a-zA-Z]+$/.test(data) && !fs.existsSync(uploadPath)){                    
                    console.log("생성" + uploadPath);
                    fs.mkdirSync(uploadPath);
                }
            });
            fs.renameSync(files[key].path, "./upload" + key);
        });
        */
        res.status(200).send("확인");
    });
});


app.use((req, res, next)=>{
    throw new Error(req.url + "not found");
});
app.use(function(err, req, res, next){
    console.log(err.stack);
    const page = fs.readFileSync("./client/public/page/error.html", "utf-8");
    res.type(".html").status(500).send(page).end();
});


app.listen(PORT, ()=> console.log("server listening"));





