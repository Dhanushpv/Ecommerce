const express= require('express');
const app =express();
const dotevn = require('dotenv');
dotevn.config();


app.listen(process.env.PORT,() =>{
    console.log(`Server running at http://localhost:${process.env.PORT}`);
})
