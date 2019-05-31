const express = require("express");
const router = express.Router();

router.get('/', (req, res)=>{
    console.log(req);
    
    res.render("main", {
        admin : "findaw",
        type : "category",
    });
    
});
module.exports = router;
