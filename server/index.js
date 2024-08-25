const express = require("express");
const users = require("./sample.json")
const cors = require('cors');
const fs = require('fs');


const app = express();
const port = 8080;

//Display All Users
app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET","POST","PATCH","DELETE"]
}));

app.get("/users",(req,res) => {
    return res.json(users);
});

app.delete("/users/:id",(req,res) => {
    let id = Number(req.params.id);
    let fillteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json",JSON.stringify(fillteredUsers),(err,data) => {
        return res.json(fillteredUsers);
    })
});

app.listen(port,(err) => {
    console.log(`App is running in port ${port}`)
});
