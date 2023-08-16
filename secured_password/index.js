const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

const users = []

// Endpoints
app.get('/users',(req, res)=>{ // READ
    res.json(users)
})

app.post('/users', async (req, res)=>{// CREATE
    try {
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        //const hashPassword = await bcrypt.hash(req.body.password, 10)
        console.log(salt)
        
        console.log(hashPassword)
        const user = { name: req.body.name, password: hashPassword }
        users.push(user)
        res.status(201).send('Created successfully')

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
    //hash(salt + 'password') // 
    //hash(salt1 + 'password') // dfjmcvclsjfllfld
});

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

const PORT = 5000;
app.listen(PORT,() => {
    console.log(`Server running at port: ${PORT}`);
})
