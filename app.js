require("dotenv").config();
const express = require('express');
const app = express();
const productRouter = require("./router/routes/product.router")

app.use(express.json());
app.use("/api/products",productRouter);


app.listen(process.env.APP_PORT,()=>{
    console.log("Server Up And Running @",process.env.APP_PORT);
});