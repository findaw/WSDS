const express = require("express");
const router = express.Router();
const formidable = require("formidable");

router.use(express.static("client/public"))
router.get('/category', (req, res)=>{
    res.render("main", {
        admin : "findaw",
        type : "writeCategory",
    })
});
router.get('/case', (req, res)=>{
    res.render("main", {
        admin : "findaw",
        type : "writeCase",
    })
});
router.post('/category/check', (req, res)=>{
    const form = formidable.IncomingForm();
    form.parse(req, (err, fields, files)=>{
        console.log(fields);
        res.status(200).send("OK<script>window.location.href='/'</script>");
    });
});
router.post('/case/check', (req, res)=>{
    const form = formidable.IncomingForm();
    form.parse(req, (err, fields, files)=>{
        console.log(fields);
        res.status(200).send("OK<script>window.location.href='/'</script>");
    });
});

module.exports = router;
