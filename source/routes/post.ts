import express from 'express';
import {customer,order,orderItem,product,supplier,extraFeatures} from '../controller/index'

const router = express.Router();

/*
 crud apis for Customer
*/   
router.get('/customers', customer.getCustomer);
router.get('/getcustomer/customer/:id',customer.getCustomers);
router.put('/customer/:id', customer.updateCustomer);
router.delete('/customer/:id', customer.deleteCustomer);
router.post('/customer', customer.addCustomer);

/*
 crud apis for order
*/
router.get('/orders', order.getorders);
router.get('/getorder/order/:id', order.getOrder);
router.put('/order/:id', order.updateOder);
router.delete('/order/:id', order.deleteOrder);
router.post('/order', order.addOrder);

/*
 crud apis for orderitems
 */
router.get('/orderItems', orderItem.getOderItems);
router.get('/orderItem/:id', orderItem.getOderItem);
router.put('/orderItem/:id', orderItem.updateOderItem);
router.delete('/orderItem/:id', orderItem.deleteOrderItem);
router.post('/orderItem', orderItem.addOderItem);

/*
 crud apis for products
 */
router.get('/products', product.getProducts);
router.get('/product/:id', product.getProduct);
router.put('/product/:id', product.updateProduct);
router.delete('/product/:id', product.deleteProduct);
router.post('/product', product.addProduct);

/*
 crud apis for supplier
 */
router.get('/suppliers', supplier.getSuppliers);
router.get('/supplier/:id', supplier.getSupplier);
router.put('/supplier/:id', supplier.updateSupplier);
router.delete('/supplier/:id', supplier.deleteSupplier);
router.post('/supplier', supplier.addSupplier);




/* 
    api for geting orderItems based on orderId
*/
router.get('/orderItems/:orderId',extraFeatures.getOrderItems)

/* 
    api for geting customer Details based on Customer mobile
*/
router.get('/customer/details/:phone',extraFeatures.isCustomer)

/*
    api for adding order based on customer id 
*/
router.post('/addOrder',extraFeatures.addOrder)

/*
    api for adding products
*/
router.post('/addProducts',extraFeatures.addProducts)

/*
    api for checkout
*/
router.get('/checkout/:customer_id',extraFeatures.checkOut)


export = router;


