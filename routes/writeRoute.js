const express = require("express");
const router = express.Router();
const fs = require("fs");

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

module.exports = router;
