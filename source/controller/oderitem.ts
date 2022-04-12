import { Request, Response, NextFunction } from 'express';
import {connection} from '../database/dbConnection';

interface Post {
    Id:number;
    OderId:number;
    ProductId:number;
    UnitPrice:number;
    Quantity:number;

}

// getting all posts
const getOderItems = async (req: Request, res: Response, next: NextFunction) => {
   let result = await (await connection).query(`select * from [eCommerceDb].[dbo].[OrderItem]`);
   
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
const getOderItem = async (req: Request, res: Response, next: NextFunction) => {
   
    let id: string = req.params.id;
    console.log(req.params.id);
  let result = await (await connection).query(`select * from [eCommerceDb].[dbo].[OrderItem] where Id=${id}`);

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
const updateOderItem = async (req: Request, res: Response, next: NextFunction) => {
    
    let id:string=req.params.id;
    let result_id =await (await connection).query(`select top (1) * from [eCommerceDb].[dbo].[OrderItem] where Id=${id}`);

    let OrderId =req.body.OrderId ? req.body.OrderId : result_id[0].OrderId;
    let ProductId = req.body.ProductId ? req.body.ProductId : result_id[0].ProductId;
    let UnitPrice=req.body.UnitPrice ? req.body.UnitPrice : result_id[0].UnitPrice;
    let Quantity= req.body.Quantity ? req.body.Quantity :result_id[0].Quantity;

    let result = await (await connection).query(`UPDATE [eCommerceDb].[dbo].[OrderItem]
    SET OrderId=${OrderId},ProductId=${ProductId},UnitPrice=${UnitPrice},Quantity=${Quantity}
    WHERE id = ${id};
    `);
    
   
        return res.status(200).json({
            message: "successfully updated"
           
        }); 
};

// deleting a post
const deleteOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    
    let id: string = req.params.id;

    
    let result = await (await connection).query(`DELETE FROM [eCommerceDb].[dbo].[OrderItem] WHERE Id = ${id}`);
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};

// adding a post
const addOderItem = async (req: Request, res: Response, next: NextFunction) => {

    
    let OrderId =req.body.OrderId ;
    let ProductId = req.body.ProductId;
    let UnitPrice=req.body.UnitPrice;
    let Quantity= req.body.Quantity;

   

    let result = await (await connection).query(`INSERT INTO [eCommerceDb].[dbo].[OrderItem] ([OrderId],[ProductId],[UnitPrice],[Quantity])VALUES(${OrderId},${ProductId},${UnitPrice},${Quantity})`);
   
  
    return res.status(200).json({
        message: "successfully inserted Orderdata"
    });
};

export default {getOderItems,getOderItem,updateOderItem,deleteOrderItem,addOderItem };