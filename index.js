const express = require('express')
const todoRouter = require('./routes/todoroute')
const authorRoute = require('./routes/authorRoute')
const authorModel = require('./models/author_model')
const bodyParser = require('body-parser')
const CONFIG = require('./config/config')
const ConnectToDb = require('./db/mongoDb')
const helmet = require('helmet')
const passport = require('passport')
const session = require ('express-session')
const connectEnsureLogin = require('connect-ensure-login')
const moment = require('moment')
const { error } = require('winston')


const app = express()

// connect to mongoDb
ConnectToDb()

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxage: 60*60*1000}
}))

app.use(helmet())

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(passport.initialize())  // to initialise the passport MW

app.use(passport.session()) // to use passport session MW
passport.use(authorModel.createStrategy()) // to use the authorModel in creating the auth strategy
passport.serializeUser(authorModel.serializeUser()) // to get and save as an object
passport.deserializeUser(authorModel.deserializeUser())


app.use('/todos/v1/', connectEnsureLogin.ensureLoggedIn(), todoRouter)
app.use('/authors/v1/', authorRoute)

// home route
app.get('/', async(req, res)=>{
    return res.status(200).json({
        status: true,
        message: "WELCOME TO MY TODO APP"
    })
})

// signUp route
app.post('/signup', async (req, res) => {
    try {
        const body = req.body;

        const newAuthor = new authorModel({
            firstname: body.firstname,
            lastname: body.lastname,
            username: body.username,
            gender: body.gender,
            bio: body.bio,
            dob: body.dob,
            country: body.country,
            createdAt: moment().toDate()
        });

        // Register the new author
        authorModel.register(newAuthor, body.password, (err, author) => {
            if (err) {
                // Handle registration errors
                // return res.status(400).render('signup', {
                //     message: err.message || "Could not sign up this new user!",
                //     error: true
                // });
                return res.status(400).json({
                    message: err.message || "Could not sign up this new User, Try Again!"
                })
            }

            // Authenticate the newly registered author
            return res.status(200).json({
                message: "New Author Successfully Registered.",
                author
            })
            // return res.status(201).render('todos', {
        //     message: "New Author Successfully Created"
             // })
            // });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



// login route
// find the id of the logged in user using his provided username and password
// username in the model must be made unique
// use the id to redirect to the user's todo list page
// app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), async (req, res) =>{
//    const user = await authorModel.findOne({
//         username: req.body.username
//     })

//     if(!user){
//         return res.status(404).json({
//             message:"User does not exist. Enter your correct Username and Password!! "
//         })
//     }
//     else{
//         // const userId = author.id
//         // to use this, i need to link todos to the author model
//         // send back the author found, and through the author the todos referenced to his id can be accessed
//         // the aim is to display only the author's todos after a successful login
//         // return res.redirect('/todos/v1/', {author: author})
//         return res.status(200).json({
//             message:"Welcome back!",
//             user
//         })
//     }
// })

// app.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid username or password.'}), (req, res) => {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.status(200).json({
//         message: "Welcome back!!",
//         author: req.user
//     });
// });


app.post('/login', async(req, res, next) => {
     passport.authenticate('local', (err, user, info) => {
         if (err) {
             return res.status(500).json({ message: 'Internal Server Error' });
         }
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        return res.status(200).json({
            message:"User Successfully Logged In",
            user
        })
        (req, res, next);
    })
})



// error handler MW
app.use((error, req, res, next)=>{
    console.log(error)
    const errorStatus = error.status || 500

    res.status(errorStatus).json({
        status: false,
        message: "An error occured"
    })

    next()
})

// logout route created from passport
app.post('/logout', (req, res)=>{
    req.logout()
    res.redirect('/')
})


// create a server
app.listen(CONFIG.PORT, ()=>{
    console.log("listening to port: http://localhost:"+CONFIG.PORT)
})
