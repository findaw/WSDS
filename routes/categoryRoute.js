const express = require("express");
const router = express.Router();

router.use(express.static("client/public"))

router.get('/', (req, res)=>{
    
    res.render("category", {
        admin : "findaw",
        type : "category",
    });
    
});
router.get('/fishing', (req, res)=>{
    res.render("category", {
        admin : "findaw",
        type : "category",
    });
    
});
module.exports = router;
