// SETUP VARIABLES
// Including the mySQL & inquirer npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");

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
var prodArr = [];
var depArr = [];
var addStock = 0;


/************************************************/
// FUNCTIONS
// List a set of menu options
var mgrMenu = function() {
	inquirer.prompt([
		{
			type: "list",
			message: "What would you like to do?",
			name: "action",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		}
	]).then(function(user) {
		switch (user.action) {
			// If a manager selects View Products for Sale, calling the listInventory() function
			case "View Products for Sale":
				listInventory();
				break;
			// If a manager selects View Low Inventory, calling the lowInventory() function
			case "View Low Inventory":
				lowInventory();
				break;
			// If a manager selects Add to Inventory, calling the addMorePrompt() function
			case "Add to Inventory":
				addMorePrompt();
				break;
			// If a manager selects Add New Product, calling the newProd() function
			case "Add New Product":
				newProd();
				break;
		}
	});
};

// Listing every available item
var listInventory = function() {
	connection.query("SELECT * FROM products", 
    function(err, res) {
        if (err) {
            throw err;
        }
        console.log("*******************************");
        console.log("Products for sale:");
        for (var i = 0; i < res.length; i++) {
            /////// FIX TO DISPLAY second 0
            console.log("ID# %s | %s | $%s | %s",res[i].item_id,res[i].product_name,res[i].price,res[i].stock_quantity);
        }
        console.log("*******************************");
        // Calling the function to display the menu again
        mgrMenu();
    });
};

// Listing all items with inventory counts lower than five
var lowInventory = function() {
connection.query("SELECT item_id, product_name, stock_quantity FROM products",
        function(err, res) {
            if (err) {
                throw err;
            }
            console.log("\n*******************************");
	        console.log("Time to restock! Less than five remaining of the below items:");
            for (var i = 0; i < res.length; i++) {
	            if (res[i].stock_quantity < 5) {
	                
	                console.log("ID# %s | %s | %s",res[i].item_id,res[i].product_name,res[i].stock_quantity);
	            }
	        }
	        console.log("*******************************\n");
	        // Calling the function to display the menu again
	        mgrMenu();
        }
    );
};

// Displaying a prompt that will let the manager "add more" of any item currently in the store
var addMorePrompt = function() {
	connection.query("SELECT item_id, product_name, stock_quantity, price FROM products", 
        function(err, res) {
            if (err) {
                throw err;
            }
	    	for (var i = 0; i < 15; i++) {
	    		prodArr.push(res[i].product_name);
	    	};

		inquirer.prompt([
			{
				type: "list",
				message: "What would you like to add more of?",
				name: "addMore",
				choices: prodArr
			},
			{
				type: "input",
				message: "How many would you like to order?",
				name: "orderQuant"
			}
		]).then(function(user) {
	    	addStock = res[0].stock_quantity + parseInt(user.orderQuant);
	    	console.log("add stock: " + addStock);

		    connection.query("UPDATE products SET ? WHERE ?", [ 
		        {
		          stock_quantity: addStock
		        },
		        {
		          product_name: user.addMore
		        }], 
		        function(err, res) {

		        }
		    );
			// Calling the function to display the menu again
			mgrMenu();
		});
	});
};

// Allowing the manager to add a completely new product to the store
var newProd = function() {
	connection.query("SELECT item_id, department_name FROM products", 
        function(err, res) {
            if (err) {
                throw err;
            }
	    	for (var i = 0; i < math.Max(res.item_id) + 1; i++) {
	    		depArr.push(res[i].department_name);
	    	};
	    	///// Figure out how to not display duplicate dep'ts
		inquirer.prompt([
			{
				type: "input",
				message: "What new product would you like to order?",
				name: "newProdName"
			},
			{
				type: "list",
				message: "Under what department does this product belong?",
				name: "newProdDep",
				choices: depArr
			},
			{
				type: "input",
				message: "What is its price?",
				name: "newProdPrice"
			},
			{
				type: "input",
				message: "How many would you like to order?",
				name: "newProdQuant"
			}
		]).then(function(user) {
			connection.query("INSERT INTO products SET ?", [
		        {
		          product_name: user.newProdName,
		          department_name: user.newProdDep,
		          price: user.newProdPrice,
		          stock_quantity: user.newProdQuant
		        }], 
		        function(err, res) {
		        	console.log("\n*******************************");
		        	console.log("Item ordered!");
		        	console.log("*******************************\n");
		        	// Calling the function to display the menu again
		        	mgrMenu();
		        }
		    );
		});
	});
};

/************************************************/
// MAIN PROCESSES
// Connecting to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mgrMenu();
});