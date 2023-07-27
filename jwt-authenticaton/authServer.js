
require('dotenv').config()

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let refreshTokens = []

app.post('/token',(req, res) => {
    const refreshToken = req.body.token 
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
        if (err) return res.sendStatus(403)
        const accessToken = generateAcessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
});

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

// Routes
app.post('/login', (req, res)=>{
    //Authenticate User
    const username = req.body.username
    const user = { name: username }
    
    const accessToken = generateAcessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken:refreshToken })
});

function generateAcessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'40s'})
}

const PORT = 4000

app.listen(PORT, () => {
console.log(`Server running at port: ${PORT}`);
})
