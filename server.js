if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

//import libraries
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")


initializePassport(
    passport,
    email => users.find(user => user.email === email)
    )

const users = []

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//config
app.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))


//Config register post function
app.post("/register", async(req, res) =>{
    try{
        const hashedPassword = await bcryp.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        console.log(users)
        res.redirect("/login")
    }catch (e) {
        console.log(e)
        res.redirect("/register")

    }
})

//routes
app.get('/home-page', (req, res)=>{
    res.render("index.ejs")
})

app.get('/login', (req, res)=>{
    res.render("login.ejs")
})

app.get('/register', (req, res)=>{
    res.render("register.ejs")
})

app.get('/forgotpassword', (req, res)=>{
    res.render("forgotpassword.ejs")
})

//end routes

app.listen(3030)