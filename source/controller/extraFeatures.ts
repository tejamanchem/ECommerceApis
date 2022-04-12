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

const isCustomer =async (req: Request, res: Response, next: NextFunction)=>{

    let customerMobile = req.params.phone;

    let customerDetails =  await(await connection).query(`select * from [eCommerceDb].[dbo].[Customer] where Phone='${customerMobile}'`)

    if(customerDetails.length){
        return res.status(200).json({
            customerDetails:customerDetails
        })
    }
    else{
        return res.status(404).json({
            message:`no Customer found with mobile number '${customerMobile}'`
        })
    }
}

const addProducts = async (req:Request,res:Response,next:NextFunction)=>{

    let customer_id = req.body.customerId;
   let items:{product:number,quantity:number}[] = req.body.items;

    let customerDetails =  await(await connection).query(`select * from [eCommerceDb].[dbo].[Customer] where Id=${customer_id}`)

    if(customerDetails.length){
            let unavilable_products:any[]=[];
            let ordersItemsIds:any={};
            
        
            let result = await (await connection).query(`select * from [eCommerceDb].[dbo].[Order] where CustomerId=${customer_id} and TotalAmount=0  order by OrderDate DESC`);
            let order_id;
            
            if(result.length){
                 order_id = result[0].Id
            }
            else{
                let orderDate=convert(new Date());
                let orderNumber = Math.floor(Math.random() * (600000 - 550000 +1)) + 550000;
                let orders = await(await connection).query(`INSERT INTO [eCommerceDb].[dbo].[Order] ([OrderDate],[OrderNumber],[CustomerId]) VALUES('${orderDate}',${orderNumber},${customer_id})`)
                let orders_id = await(await connection).query(`select * from [eCommerceDb].[dbo].[Order] where  OrderNumber=${orderNumber} and CustomerId=${customer_id}`)
                order_id=orders_id[0].Id

            }
            ordersItemsIds[order_id]=[]
            for(let i=0;i<items.length;i++){
                let existed_product:any[] = await (await connection).query(`select top (1) * from [eCommerceDb].[dbo].[Product] where Id =${items[i].product} and IsDiscontinued=0`); 
                if(existed_product.length){
                    let ordersItems =await(await connection).query(`INSERT INTO [eCommerceDb].[dbo].[OrderItem] ([OrderId],[ProductId],[UnitPrice],[Quantity])VALUES(${order_id},${items[i].product},${existed_product[0].UnitPrice},${items[i].quantity})`);
                    let itemsIds = await(await connection).query(`select * from [eCommerceDb].[dbo].[OrderItem] where OrderId = ${order_id} and ProductId=${items[i].product} and UnitPrice= ${existed_product[0].UnitPrice} and Quantity=${items[i].quantity}`)
                    ordersItemsIds[order_id].push(itemsIds[0].Id)
                }
                else{
                    unavilable_products.push(items[i].product)                  
                }
            }

           return res.status(200).json({
               customerId : customer_id,
               ordersItemsIds:ordersItemsIds,
               unavilable_products:unavilable_products,
               message:"success"
           })
        }
        else{
            return res.status(404).json({
                message:"no customer found"
            })
        }
    }
const checkOut = async(req:Request,res:Response,next:NextFunction)=>{

        let customerId = req.params.customer_id;

        let CustomerDetails = await (await connection).query(`select * from [eCommerceDb].[dbo].[Customer] where Id =${customerId}`);

        if(CustomerDetails.length){

            let orderDetails = await(await connection).query(`select * from [eCommerceDb].[dbo].[Order] where CustomerId =${customerId} and TotalAmount=0`)
            let ordersIds:any[]=[];
            let total_amount;
            if(orderDetails.length){
            
                for(let i=0;i<orderDetails.length;i++){
                    if(orderDetails[i].TotalAmount==0){
                        let orderItemDetails = await(await connection).query(`select * from [eCommerceDb].[dbo].[OrderItem] where OrderId =${orderDetails[i].Id}`)

                        total_amount = await (await connection).query(`SELECT 
                         sum(UnitPrice * Quantity)  AS total_price
                         FROM OrderItem where OrderId=${orderDetails[i].Id}`)
                        console.log(total_amount[0].total_price);
                        console.log(orderDetails[i].Id);
                       let updatingOrder = await (await connection).query(`UPDATE [eCommerceDb].[dbo].[Order]
                       SET TotalAmount=${total_amount[0].total_price}
                       WHERE Id = ${orderDetails[i].Id};
                       `);
                       ordersIds.push(orderDetails[i].Id)

                    }
                }

                return res.status(200).json({
                    orderId :ordersIds,
                    total_amount :total_amount,
                    message:"success"
                    
                })

            }
            else{
                return res.status(404).json({
                    message:"no orders found with this id"

                })
            }
        }
        else{
            return res.status(404).json({
                message:"no customer with this id"
            })
        }
 }


const addOrder = async (req: Request, res: Response, next: NextFunction) => {
    
  
    let order_number = Math.floor(Math.random() * (600000 - 550000 +1)) + 550000;
    let OrderDate =req.body.OrderDate ? convert(req.body.OrderDate) :convert( new Date());
    let OrderNumber = req.body.OrderNumber ? req.body.OrderNumber : order_number;
    let CustomerId=req.body.CustomerId;

    let result = await (await connection).query(`INSERT INTO [eCommerceDb].[dbo].[Order] ([OrderDate],[OrderNumber],[CustomerId])VALUES('${OrderDate}','${OrderNumber}',${CustomerId})`);
   
    let addedOrder = await(await connection).query(`select * from [eCommerceDb].[dbo].[Order] where OrderDate='${OrderDate}' and OrderNumber='${OrderNumber}' and CustomerId=${CustomerId}`)
      return res.status(200).json({
          OrderId : addedOrder[0].Id,
          message: "successfully inserted Orderdata"
      });
 }
function convert(str:any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

const getOrderItems = async(req:Request,res:Response,next:NextFunction)=>{

    let order_id = req.params.orderId;

    let orderIdDetails = await(await connection).query(
    `SELECT TOP (1000) [Id]
    ,[OrderId]
    ,[ProductId]
    ,[UnitPrice]
    ,[Quantity]
    FROM [eCommerceDb].[dbo].[OrderItem]
    where OrderId=${order_id}`);

    if(orderIdDetails.length){
        return res.status(200).json({
            response:orderIdDetails,
            message:"success"
        })
    }
    else{
        return res.status(404).json({
            message:"No OderItem with this OrderId"
        })
    }

  }
  
export default{isCustomer,addProducts,checkOut,addOrder,getOrderItems};
