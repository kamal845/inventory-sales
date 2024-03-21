const express=require('express');
const app = express();
const billroutes=require('../routes/billroute');
const inventoryroutes=require('../routes/inventoryroute');
const salesroutes=require('../routes/salesroute');
app.use('/inventory', inventoryroutes);
app.use('/sales',salesroutes);
app.use('/bill',billroutes);
module.exports = app;
