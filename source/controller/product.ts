import {Request,Response,NextFunction} from 'express'
import {connection} from '../database/dbConnection'

interface product{
    Id:number;
    ProductName:string;
    SupplierId:number;
    UnitPrice:number;
    Package:string;
    IsDiscontinued:string;
}


const getProducts = async(req:Request,res:Response,next:NextFunction)=>{
    let result:any[] = await (await connection ).query(`select * from [eCommerceDb].[dbo].[Product]`);
 
    if(result.length){
        return res.status(200).json({
            message:"success",
            result:result
        })
    }
    else{
        return res.status(404).json({
            message:"no products to display"
        })
    }

}


const getProduct= async(req:Request,res:Response,next:NextFunction)=>{

    let id = req.params.id;

        let result:any[] = await(await connection).query(`select * from [eCommerceDb].[dbo].[Product] where Id=${id}`);

        if(result.length){
            return res.status(200).json({
                message:"success",
                result:result
            })
        }
        else{
            return res.status(404).json({
                message:"No Product found with id"
            })
        }


}

const updateProduct = async(req:Request,res:Response,next:NextFunction)=>{

    let id = req.params.id;

    let result:any[] = await(await connection).query(`select top (1) * from [eCommerceDb].[dbo].[Product] where id=${id}`);


    if(result.length){

        let ProductName =req.body.ProductName?req.body.ProductName:result[0].ProductName;
        let SupplierId = req.body.SupplierId?req.body.SupplierId:result[0].SupplierId;

        let UnitPrice = req.body.UnitPrice?req.body.UnitPrice:result[0].UnitPrice;

        let Package = req.body.Package?req.body.Package:result[0].Package;

        let IsDiscontinued= req.body.IsDiscontinued?req.body.IsDiscontinued:result[0].IsDiscontinued;

        let query_response = await(await connection).query(`update [eCommerceDb].[dbo].[Product] set ProductName='${ProductName}',SupplierId=${SupplierId},UnitPrice=${UnitPrice},Package='${Package}',IsDiscontinued='${IsDiscontinued}'`);
        let updated_data = await(await connection).query(`select * from [eCommerceDb].[dbo].[Product] where id=${id}`);
        return res.status(200).json({
            message:"success fully updated data",
            updated_data:updated_data
        })

    }
     else{
         return res.status(404).json({
             message:"no Product found with given id"
         })
     }
}

const deleteProduct = async(req:Request,res:Response,next:NextFunction)=>{
    let id = req.params.id;

    let result = await(await connection).query(`delete from [eCommerceDb].[dbo].[Product] where Id=${id}`);

    return res.send(200).json({
        message:"succcessfully deleted Product"
    });
}

const addProduct = async(req:Request,res:Response,next:NextFunction)=>{
    let ProductName = req.body.ProductName
    let SupplierId = req.body.SupplierId;
    let UnitPrice = req.body.UnitPrice;
    let Package=req.body.Package;
    let IsDiscontinued = req.body.IsDiscontinued;

    let result = await(await connection).query(`insert into [eCommerceDb].[dbo].[Product] ([ProductName],[SupplierId],[UnitPrice],[Package],[IsDiscontinued])Values('${ProductName}',${SupplierId},${UnitPrice},'${Package}',${IsDiscontinued})`);

    return res.status(200).json({
        message:"Product saved successfully"
    })
    }

    export default{getProduct,getProducts,updateProduct,deleteProduct,addProduct};
