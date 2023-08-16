
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

/**
    ############### BREAKDOWN OF CODE ############################
    
    1. The server listens on port 4000 for incoming HTTP requests.

    2. The generateAccessToken function generates an access token for a given user. 
       The access token is signed using the process.env.ACCESS_TOKEN_SECRET as the 
       secret key and has an expiration time of 40 seconds.

    3. When a user logs in (/login route), the server generates an access token and 
       a refresh token for the user. The refresh token is also signed using the 
       process.env.REFRESH_TOKEN_SECRET as the secret key. The generated refresh token 
       is then stored in the refreshTokens array. Both the access token and refresh 
       token are sent back to the client as a JSON response.

    4. The client can then use the received access token to access protected routes 
       for the next 40 seconds. After the access token expires, the client can use 
       the refresh token to request a new access token.

    5. When the client needs a new access token (/token route), it sends the refresh 
       token in the request body. The server verifies the refresh token using 
       jwt.verify. If the refresh token is valid and exists in the refreshTokens 
       array, the server generates a new access token and sends it back to the client.

    6. If the client wants to log out (/logout route), it sends the refresh token 
       in the request body. The server removes the refresh token from the 
       refreshTokens array, effectively invalidating it.
 */
