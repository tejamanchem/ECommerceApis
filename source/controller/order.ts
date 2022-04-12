import { Request, Response, NextFunction } from 'express';
import {connection} from '../database/dbConnection';

interface Post {
    Id: Number;
    FirstName: string;
    LastName: String;
    City:string;
    Country: String;
    Phone:string;
    OrderDate:string;
    OrderNumber:number;
    CustomerId:Number;
    TotalAmount:number;

}

// getting all posts
const getorders = async (req: Request, res: Response, next: NextFunction) => {
   let result = await (await connection).query(`select * from [eCommerceDb].[dbo].[Order]`);
   
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

// getting a single post
const getOrder = async (req: Request, res: Response, next: NextFunction) => {
   
    let id: string = req.params.id;
    console.log(req.params.id);
  let result = await (await connection).query(`select * from [eCommerceDb].[dbo].[Order] where Id=${id}`);

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
const updateOder = async (req: Request, res: Response, next: NextFunction) => {
    
    let id:string=req.params.id;
    let result_id =await (await connection).query(`select top (1) * from [eCommerceDb].[dbo].[Order] where Id=${id}`);

    let OrderDate =req.body.OrderDate ? convert(req.body.OrderDate) :convert( result_id[0].OrderDate);
    let OrderNumber = req.body.OrderNumber ? req.body.OrderNumber : result_id[0].OrderNumber;
    let CustomerId=req.body.CustomerId ? req.body.CustomerId : result_id[0].CustomerId;
    let TotalAmount= req.body.TotalAmount ? req.body.TotalAmount :result_id[0].TotalAmount;

    let result = await (await connection).query(`UPDATE [eCommerceDb].[dbo].[Order]
    SET OrderDate='${OrderDate}',OrderNumber='${OrderNumber}',CustomerId=${CustomerId},TotalAmount=${TotalAmount}
    WHERE id = ${id};
    `);
    
    let updated_order = await (await connection).query(`select * from [eCommerceDb].[dbo].[Order] where OrderDate='${OrderDate}'and OrderNumber='${OrderNumber}'and CustomerId=${CustomerId} and TotalAmount=${TotalAmount}`)
   
        return res.status(200).json({

            orderId :updated_order[0].Id,
            message: "successfully updated"
           
        });

    
   
   
};
function convert(str:any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  

// deleting a post
const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    
    let id: string = req.params.id;

    
    let result = await (await connection).query(`DELETE FROM [eCommerceDb].[dbo].[Order] WHERE Id = ${id}`);
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};

// adding a post
const addOrder = async (req: Request, res: Response, next: NextFunction) => {

    
    let OrderDate =req.body.OrderDate?convert(req.body.OrderDate):convert(new Date());
    let OrderNumber = req.body.OrderId ;
    let CustomerId=req.body.CustomerId ;
    let TotalAmount= req.body.TotalAmount;
   

    let result = await (await connection).query(`INSERT INTO [eCommerceDb].[dbo].[Order] ([OrderDate],[OrderNumber],[CustomerId],[TotalAmount])VALUES('${OrderDate}','${OrderNumber}',${CustomerId},${TotalAmount})`);
   
  let addedOrder = await(await connection).query(`select * from [eCommerceDb].[dbo].[Order] where OrderDate='${OrderDate}' and OrderNumber='${OrderNumber}' and CustomerId=${CustomerId} and TotalAmount = ${TotalAmount}`)
    return res.status(200).json({
        OrderId : addedOrder[0].Id,
        message: "successfully inserted Orderdata"
    });
};

export default { getOrder,getorders,updateOder,deleteOrder,addOrder };