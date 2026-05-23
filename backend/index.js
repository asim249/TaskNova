const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config()
const connectDB = require('./config/db.config')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.route')
const todoRoutes = require('./routes/todo.route')
const cors = require('cors')


connectDB()


app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true              
}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)




app.listen(process.env.PORT, () => console.log(` app listening on port port! ${process.env.PORT}`));