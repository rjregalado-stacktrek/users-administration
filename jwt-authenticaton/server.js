require('dotenv').config()

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const notes = [
    {
        username:'Robert',
        title: 'Notes 1'
    },
    {
        username:'John',
        title: 'Notes 2'
    }
]

// Routes
app.get('/notes', authenticateToken,(req,res)=>{
    res.json(notes.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    });
    //Bearer Token
}
const PORT = 5000
app.listen(PORT, ()=>{
    console.log(`Server running at port: ${PORT}`);
})

//Generate value using crypto
//require('crypto).randomBytes(64).toString('hex') 
