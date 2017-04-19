// SETUP VARIABLES
// Including the prompt & FS npm packages
var mysql = require("mysql");
var prompt = require("prompt");
var fs = require("fs");

// Creating the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "I<3L3xikins",
    database: "Bamazon"
});


/************************************************/
// FUNCTIONS
// Connecting to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

//  Displaying all of the items available for sale, including the ids, names, and prices of products for sale
connection.query("SELECT * FROM products", 
    function(err, res) {
        if (err) {
            throw err;
        }
        console.log("*******************************");
        for (var i = 0; i < res.length; i++) {
            /////// FIX TO DISPLAY second '0'
            console.log("Item %s) %s - $%s",res[i].item_id,res[i].product_name,res[i].price);
        }
        console.log("*******************************");
    }
);


/************************************************/
// MAIN PROCESSES