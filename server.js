const express = require("express");
const res = require("express/lib/response");
const { json } = require("express/lib/response");
const path = require('path');
const bcrypt = require("bcryptjs")// for hashing passwords
const costFactor = 10; // used for the alt
let authenticated = false; // used to see if user is logged in
let username = ""; //used to tell which user's data to access

// let's make a connection to our mysql server
const mysql = require("mysql2")

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
     password: "Ca.th2lo",
    //password: "monaco14",
    database: "dilemma"
})

conn.connect(function(err){
    if(err){
        console.log("Error:", err);
    }else{
        console.log("Connection established.")
    }
})

// app will be our express instance
const app = express();
username="ckim"
password="12345"

// Serve static files from the public dir
// if you do not include this, then navigation to the localhost will not show anything
app.use(express.static(path.join(__dirname, 'public'))); // will use the index.html file

// the following is a route
// serve home page
// note that our callback function is anonymous here
app.get("/registration", function(req, res){
    if (authenticated) {
        authenticated = false;
    }
    res.sendFile(__dirname + "/public/html/" + "registration.html");
})

// post to route "attempt login"
app.post("/attempt_login", function(req, res){
    // we check for the username and password to match.
    conn.query("select username, password from registeredusers where username = ?", [req.body.username], function (err, rows){
        if(err || rows.length === 0){
            authenticated = false;
            res.json({success: false, message: "This username does not exist!"});
        }else{
            storedPassword = rows[0].password // rows is an array of objects e.g.: [ { password: '12345' } ]
            // bcrypt.compareSync let's us compare the plaintext password to the hashed password we stored in our database
            if (bcrypt.compareSync(req.body.password, storedPassword)){
                authenticated = true;
                username = rows[0].username; //username of signed in user is saved
                // res.redirect("/main");
                res.json({success: true, message: "Welcome back " + username + "!"})
            }else{
                res.json({success: false, message:"This password is incorrect!"})
            }
        }
    })  
})

app.post("/saveRandom", function(req,res) {
    //not sure if req.body.recipeName is correct way to get random recipe's name
    conn.query("select user, recipeName from savedRecipes where user = ? and recipeName = ?", [username, req.body.recipeName], function(err,rows){
        if(err){
            res.json({success: false, message: "Server Error"})
            console.log("select err:" + err);
        }
        else if (rows.length > 0){
            res.json({success: false, message: "This recipe has already been saved!"})
        }
        else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy+'-'+mm+'-'+dd;
            //savedRecipes takes in user, recipeName, recipeIngredients, recipeInstructions, accessDate, image, comment 
            insertUser = "insert into savedRecipes values(?, ?, ?, ?, ?, ?, '')"
            //currently comment set to null

            conn.query(insertUser, [username, req.body.recipeName, req.body.ingredients, req.body.instructions, today, req.body.recipeImg], function(err, rows){ 
                if (err){
                    res.json({success: false, message: "Server error"})
                    console.log("insert err:" + err);
                }
                else{
                    res.json({success: true, message: "Recipe successfully saved!"})
                }
            })
        }
    })
})

app.post("/getSaved", function(req,res) {
    conn.query("select recipeName, recipeIngredients, recipeInstructions, image, comment from savedRecipes where user = ? order by accessDate DESC", [username], function(err, rows){
        if(err) {
            res.json({success: false, message: "Server Error"})
        } else if (rows.length === 0) {
            res.json({success: true, message: "Looks like you have no saved recipes. Go add some!"})
        } else {
            res.json({success: true, message:"loaded", rows})
        }
    })
})

app.post("/getLinked", function(req,res) {
    conn.query("select recipeName, link, comment from linkedRecipes where user = ? order by accessDate DESC", [username], function(err, rows){
        if(err) {
            res.json({success: false, message: "Server Error"})
            console.log(err);
        } else if (rows.length === 0) {
            res.json({success: true, message: "Looks like you have no linked recipes. Go add some!"})
        } else {
            res.json({success: true, message:"loaded", rows})
        }
    })
})
app.post("/saveLinkedRecipe", function(req,res){
    conn.query("select user, link from linkedrecipes where user = ? and link = ?", [username, req.body.link], function(err, rows){
        if(err){
            res.json({success: false, message: "Server Error"})
            console.log(err);
        }
        else if (rows.length > 0){
            res.json({success: false, message: "This link has already been uploaded!"})
        }
        else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy+'-'+mm+'-'+dd;
            //linked recipes take user, recipe name, link, date, and a comment, for now comment = null
            insertUser = "insert into linkedrecipes values(?, ?, ?, ?, '')"
            conn.query(insertUser, [username, req.body.recipeName, req.body.link, today], function(err, rows){ //req.body.recipeName does not exist yet
                if (err){
                    res.json({success: false, message: "Server error"})
                    console.log(err);
                }
                else{
                    res.json({success: true, message: "Recipe successfully uploaded!"})
                }
            })
        }
    })
}) 

app.post("/saveComment", function(req, res){
    insertComment = "update savedRecipes set comment = ? where user = ? and recipeName = ?"
    conn.query(insertComment, [req.body.comment, username, req.body.recipeName], function(err, rows){ 
        if (err){
            res.json({success: false, message: "Server error"})
            console.log("insert err:" + err);
        }
        else{
            res.json({success: true, message: "Comment successfully saved!"})
        }
    })
}) 

app.post("/linkComment", function(req, res){
    updateLinkComment = "update linkedRecipes set comment = ? where user = ? and recipeName = ?"
    conn.query(updateLinkComment, [req.body.comment, username, req.body.recipeName], function(err, rows){ 
        if (err){
            res.json({success: false, message: "Server error"})
            console.log("insert err:" + err);
        }
        else{
            res.json({success: true, message: "Comment successfully saved!"})
        }
    })
}) 



// if the user navigates to localhost:3000/main, then the main page will be loaded.
app.get("/main", function(req, res){
    if(authenticated){
        res.sendFile(__dirname + "/public/html/" + "main.html");
    }else{
        res.sendFile(__dirname + "/public/")
    }
    
})


// Start the web server
// 3000 is the port #
// followed by a callback function
app.listen(3000, function() {
   console.log("Listening on port 3000...");
});