const pool = require("./config/db")

module.exports = {
    getProduct: (data,callback) =>{

            pool.query(
            'select * from product',
            [],
            (error,results,fields)=>
            {
                if(error)
            {
               return callback(error);
            }
            return callback(null,results);
            }
           
            );
        }    

};