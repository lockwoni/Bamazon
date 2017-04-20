// SETUP VARIABLES
// Including the mySQL & prompt npm packages
var mysql = require("mysql");
var prompt = require("prompt");

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

// Creating global variables
var userUnits;
var userItem;
var userTotal;
var updatedStock;

// Creating the properties for the prompt
var schema = {
    properties: {
        ID: {
            description: "Item ID",
            type: "integer",
            message: "Enter numbers only"
        },
        units: {
            description: "Units",
            type: "integer",
            message: "Enter numbers only"
        }
    }
};

/************************************************/
// FUNCTIONS
var userPrompt = function() {
    console.log("\nWhat item(s) would you like to purchase?  Please enter the item ID and unit(s) below.\n")
    // Starting the prompt
    prompt.start();
    // Prompting users with message asking them the ID of the product they would like to buy, then how many units of the product they would like to buy
    prompt.get(schema, function (err, result) {
        userUnits = result.units;
        userItem = result.ID;

        console.log("\nOrder received:\n  ID: %s\n  Units: %s", userItem, userUnits);
        quantityCheck();
    });
};

// Once the customer has placed the order, checking if the store has enough of the product to meet the customer's request
var quantityCheck = function() {
    // Checking if the store has enough of the product to meet the customer's request
    connection.query("SELECT stock_quantity, price FROM products WHERE ?", 
        [{item_id: userItem}],
        function(err, res) {
            if (err) {
                throw err;
            }
            // If not, letting user know and then preventing the order from going through
            if (res[0].stock_quantity < userUnits) {
                console.log("\n*******************************");
                console.log("Insufficient quantity!");
                console.log("*******************************\n");
            }
            else {
            // However, if your store does have enough of the product, you should fulfill the customer's order. This means updating the SQL database to reflect the remaining quantity.
                updateStock(res[0].stock_quantity, userUnits);
                console.log("\nQuantity in stock: %s",res[0].stock_quantity);

                // Once the update goes through, showing the customer the total cost of their purchase
                userTotal = res[0].price * userUnits;

                console.log("\n*******************************");
                console.log("Total cost: $%s",userTotal);
                console.log("*******************************\n");
            };
        }
    );
};

var updateStock = function(stockQuantity, userUnits) {
    updatedStock = stockQuantity - userUnits;

    connection.query("UPDATE products SET ? WHERE ?", [ 
        {
          stock_quantity: updatedStock
        },
        {
          item_id: userItem
        }], 
        function(err, res) {
        }
    );
};


/************************************************/
// MAIN PROCESSES
// Connecting to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

// Displaying all of the items available for sale, including the ids, names, and prices of products for sale
connection.query("SELECT * FROM products", 
    function(err, res) {
        if (err) {
            throw err;
        }
        console.log("*******************************");
        for (var i = 0; i < res.length; i++) {
            /////// FIX TO DISPLAY second 0
            console.log("ID# %s | %s | $%s",res[i].item_id,res[i].product_name,res[i].price);
        }
        console.log("*******************************");
        userPrompt();
    }
);

