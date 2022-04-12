import {Request,Response,NextFunction} from 'express'
import {connection} from '../database/dbConnection'

interface Supplier{
    Id:number;
    CompanyName:string;
    ContactName:string;
    ContactTitle:string;
    City:string;
  Country:string;
  Phone:string;
  Fax:string;
}

const getSuppliers = async(req:Request,res:Response,next:NextFunction)=>{
    let result:any[] = await (await connection ).query(`select * from [eCommerceDb].[dbo].[Supplier]`);
 
    if(result.length){
        return res.status(200).json({
            message:"success",
            result:result
        })
    }
    else{
        return res.status(404).json({
            message:"no suppliers to display"
        })
    }
}

const getSupplier= async(req:Request,res:Response,next:NextFunction)=>{

    let id = req.params.id;

        let result:any[] = await(await connection).query(`select * from [eCommerceDb].[dbo].[Supplier] where Id=${id}`);

        if(result.length){
            return res.status(200).json({
                message:"success",
                result:result
            })
        }
        else{
            return res.status(404).json({
                message:"No supplier found with id"
            })
        }
}

const updateSupplier = async(req:Request,res:Response,next:NextFunction)=>{

    let id = req.params.id;

    let result:any[] = await(await connection).query(`select top (1) * from [eCommerceDb].[dbo].[Supplier] where Id=${id}`);


    if(result.length){

        let CompanyName=req.body.CompanyName?req.body.CompanyName:result[0].CompanyName;
        let ContactName = req.body.ContactName?req.body.ContactName:result[0].ContactName;

        let ContactTitle = req.body.ContactTitle?req.body.ContactTitle:result[0].ContactTitle;

        let City = req.body.City?req.body.City:result[0].City;

        let Country= req.body.Country?req.body.Country:result[0].Country;

        let Phone = req.body.Phone?req.body.Phone:result[0].Phone;

        let Fax = req.body.Fax?req.body.Fax:result[0].Fax;

        let query_response = await(await connection).query(`update [eCommerceDb].[dbo].[Product] set CompanyName='${CompanyName}',ContactName='${ContactName}',ContactTitle='${ContactTitle}',City='${City}',Country='${Country}',Phone='${Phone}',Fax='${Fax}'`);
        let updated_data = await(await connection).query(`select * from [eCommerceDb].[dbo].[Supplier] where id=${id}`);
        return res.send(200).json({
            message:"success fully updated data",
            updated_data:updated_data
        })

    }
     else{
         return res.send(404).json({
             message:"no Product found with given id"
         })
     }
}

const deleteSupplier = async(req:Request,res:Response,next:NextFunction)=>{
    let id = req.params.id;

    let result = await(await connection).query(`delete from [eCommerceDb].[dbo].[Supplier] where Id=${id}`);

    return res.send(200).json({
        message:"succcessfully deleted supplier"
    });
}

const addSupplier = async(req:Request,res:Response,next:NextFunction)=>{
    let CompanyName=req.body.CompanyName;
        let ContactName = req.body.ContactName;

        let ContactTitle = req.body.ContactTitle;

        let City = req.body.City;

        let Country= req.body.Country;

        let Phone = req.body.Phone;

        let Fax = req.body.Fax;
    let result = await(await connection).query(`insert into [eCommerceDb].[dbo].[Supplier] ([CompanyName],[contactName],[ContactTitle],[City],[Country],[Phone],[Fax])Values('${CompanyName}','${ContactName}','${ContactTitle}','${City}','${Country}','${Phone}','${Fax}')`);

    return res.status(200).json({
        message:"supplier saved successfully"
    })
    }

export default{getSupplier,getSuppliers,updateSupplier,deleteSupplier,addSupplier}
