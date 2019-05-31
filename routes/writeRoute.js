const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get('/', (req, res)=>{
    res.render("main", {
        admin : "findaw",
        type : "write",
    })
});

module.exports = router;
