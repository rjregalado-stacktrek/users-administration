
// https://github.com/rjregalado-stacktrek/users-administration

require('dotenv').config()

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const notes = [
    {
        username:'Karla',
        title: 'Notes 1'
    },
    
    {
        username:'Melisa',
        title: 'Notes 2'
    },
    
    {
        username:'Alex',
        title: 'Notes 3'
    }
    ]

// Routes
app.get('/notes', authenticateToken,(req,res)=>{
    res.json(notes.filter(note => note.username === req.user.name))
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

/* 
    1.  The notes array contains some sample notes, each associated with a specific 
        username.

    2.  The new route /notes is created, which is a GET request handler. 
        This route is protected by the authenticateToken middleware, which means 
        the client must provide a valid access token in the request header to access 
        the route.

    3.  The authenticateToken middleware function reads the Authorization header 
        from the incoming request to extract the access token. It expects the token 
        to be provided in the format "Bearer [token]", so it splits the header 
        to retrieve the token value.

    4.  If no token is provided, the middleware sends a 401 (Unauthorized) 
        status response.

    5.  If a token is provided, it is verified using the jwt.verify function with 
        the process.env.ACCESS_TOKEN_SECRET as the secret key. If the token is invalid 
        or has expired, the middleware sends a 403 (Forbidden) status response.

    6.  If the token is valid, the req.user property is set to the user object decoded 
        from the access token. The decoded user object contains the name property, 
        which is set as the username in the sample notes array.

    7.  After the token verification and user identification, the middleware calls 
        next() to proceed to the /notes route handler, allowing access to the protected 
        route.

    8.  The /notes route handler sends a JSON response containing only the notes 
        associated with the authenticated user. It filters the notes array based on 
        the username stored in req.user.name.

*/


