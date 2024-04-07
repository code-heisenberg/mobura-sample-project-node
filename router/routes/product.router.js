const {getProduct} = require("./product.controller");
const router = require("express").Router();

router.get("/",getProduct);
module.exports = router;