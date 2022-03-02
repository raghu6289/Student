const express = require("express")
const {Sequelize,DataTypes}=require("sequelize")
const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded())

const sequelize=new Sequelize({
    username:"root",
    password:"root",
    database:"mydata",
    host:"localhost",
    dialect:"mysql"
})

sequelize.authenticate().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log("Failed to connect..",err);
})

// student model

const Student=sequelize.define("student",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },phoneNumber:{
        type:DataTypes.TEXT,
        allowNull:false,
        validate:{
            isNumeric:true,
        }
    },dob:{
        type:DataTypes.DATEONLY,
        allowNull:false
    }
},{
    freezeTableName:true,
    paranoid:true
})

// sync with Mysql

Student.sync({force:true}).then(()=>{
    console.log("table created");
}).catch((err)=>{
    console.log("Error occured..",err);
})

// creating APi's

// 1. insert or add data into students  // using then promise
app.post("/api/student/",(req,res)=>{
    let addStudent=Student.create(req.body).then((data)=>{
        return res.status(200).send(data)
    })
})

// 2. get all student details   // using async and await
app.get("/api/student", async (req,res)=>{
    let getAll = await Student.findAll({})
    return res.status(200).send(getAll)
})

// 3.update
app.put("/api/student/:id", async (req,res)=>{
    let id=req.params.id
    let update= await Student.update(req.body,{where:{id:id}})
    return res.status(200).send("Student data updated")
})

// 4 delete
app.delete("/api/student/:id",async (req,res)=>{
    let id=req.params.id
    let update=await Student.destroy({where:{id:id}})
    return res.status(200).send("Student data has been deleted")
})

// 5. get single data
app.get("/api/student/:id",async (req,res)=>{
    let id=req.params.id
    let getOneData=await Student.findOne({where:{id:id}})
    return res.status(200).send(getOneData)
})

//PORT
let PORT=8080

// server
app.listen(PORT,()=>{console.log("Server is running at port ",PORT);})
