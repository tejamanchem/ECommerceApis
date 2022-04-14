# ECommerceApis

sample node js apis for finding customer orders in a ECommerce ,its used here to demonstrate the steps to extend API  with your own rest api.
This sample express app, has https enabled already.

# Steps

Note
Only rest api with https support can be deployed behind API, make sure to enable https support in your rest api.
This sample express app, has https enabled already.

# PART I: Download & Build on local

# Method 1: From github

# 1) Clone the repository, install node packages and verify routes locally
# //on local
# git clone (https://github.com/tejamanchem/ECommerceApis)
# cd ECommerceApis
# npm install
# npm start

# 2) Transfer project files from local to remote host
# Note
The node_modules folder will not be transferred, we can do npm install later on remote server itself to pull down required node packages

# cd ECommerceApis
# npm run build
command for saving the changes

# npm run dev 
command to start the server

# database for this ecommerceApis 
(https://www.dofactory.com/sql/sample-database)


 # Get to know the code structure
 # src/server.ts
 The server for the ECommerceApis is starting here by express module 
 
 # src/routes
 The Apis are written here
 
 # src/database
 Connection with the database goes here by using ormconfig.json
 
 # src/controller
 All the methods for the Apis are implemented here
