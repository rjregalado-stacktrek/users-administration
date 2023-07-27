// //importing modules
// const express = require('express')
// const sequelize = require('sequelize')
// const dotenv = require('dotenv').config()
// const cookieParser = require('cookie-parser')
//  const db = require('./Models')
//  const userRoutes = require ('./Routes/userRoutes')
 

// //setting up your port
// const PORT = process.env.PORT || 8080

// //assigning the variable app to express
// const app = express()

// //middleware
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())

// //synchronizing the database and forcing it to false so we dont lose data
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("db has been re sync")
// })

// //routes for the user API
// app.use('/api/users', userRoutes)

// //listening to server connection
// app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))


require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'John',
    title: 'Post 1'
  },
  {
    username: 'Paul',
    title: 'Post 2'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(3000)
