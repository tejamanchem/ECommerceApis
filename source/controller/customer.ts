import { Request, Response, NextFunction } from 'express';
import {connection} from '../database/dbConnection';

interface Post {
    Id: Number;
    FirstName: string;
    LastName: String;
    City:string;
    Country: String;
    Phone:string;
}

// getting all posts
const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
   let result = await (await connection).query(`select * from Customer`);
   
   if(result[0]){
    return res.status(200).json({
        message: "success",
        result:result   
    });

   } 
   else{
       res.status(404).json({
           message:"no users found"
       })
   }
   
};

// getting a single post
const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
   
    let id: string = req.params.id;
    console.log(req.params.id);
  let result = await (await connection).query(`select * from Customer where Id=${id}`);

   if(result[0]){
    return res.status(200).json({
        message: "success",
        result:result   
    });

   } 
   else{
       res.status(404).json({
           message:"user not found"
       })
   }
   
};

// updating a post
const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    
    let id:string=req.params.id;
    let result_id =await (await connection).query(`select top (1) * from Customer where Id=${id}`);
if(result_id){
    let FirstName =req.body.FirstName ? req.body.FirstName : result_id[0].FirstName;
    let LastName = req.body.LastName ? req.body.LastName : result_id[0].LastName;
    let City=req.body.City ? req.body.City : result_id[0].City;
    let Country= req.body.Country ? req.body.Country :result_id[0].Country;
    let Phone = req.body.Phone ? req.body.Phone : result_id[0].Phone;
    let result = await (await connection).query(`UPDATE Customer
    SET FirstName='${FirstName}',LastName='${LastName}',City='${City}',Country='${Country}',Phone='${Phone}'
    WHERE id = ${id};
    `);
    
   
        return res.status(200).json({
            message: "successfully updated"
           
        });
}
else{
        return res.status(404).json({
            message:"customer not found"
        }
        )
}
};

// deleting a post
const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let id: string = req.params.id;

    
    let result = await (await connection).query(`DELETE FROM Customer WHERE Id = ${id}`);
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};

// adding a post
const addCustomer = async (req: Request, res: Response, next: NextFunction) => {

    
    let FirstName =req.body.FirstName ;
    let LastName = req.body.LastName ;
    let City=req.body.City ;
    let Country= req.body.Country;
    let Phone = req.body.Phone ;
   

    let result = await (await connection).query(`INSERT INTO [Customer] ([FirstName],[LastName],[City],[Country],[Phone])VALUES('${FirstName}','${LastName}','${City}','${Country}','${Phone}')`);
    let customerid = await (await connection).query(`select *  from [Customer] where FirstName='${FirstName}' and LastName = '${LastName}'  and City='${City}' and Country ='${Country}' and Phone='${Phone}'`);
    // return response
  
    return res.status(200).json({
        customer_id : customerid[0].Id,
        message: "successfully inserted customerdata"
    });
};

export default { getCustomer,getCustomers,updateCustomer,deleteCustomer,addCustomer };