const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");



router.get("/", (req, res)=>{
    res.render("main", {
        admin : "findaw",
        type : "login",
    })
    
});

router.post("/check", (req, res)=>{
    const form = formidable.IncomingForm();
    form.parse(req, (err, fields, files)=>{
        console.log(fields);
        console.log(files);
        
        //res.write("<script>alert('로그인 되었습니다.');</script>");
        res.writeHead(302, {
            "Location" :"/",
        });
        res.end();
    })
})

module.exports = router;