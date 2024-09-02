const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
app.use(express.json())


app.listen(5000, () => {
	console.log(`Server Started at port no ${process.env.PORT}`);
})

app.post('/', (req, res) => {
    res.send('mongoDB connected');
  });

mongoose.connect(process.env.MONGODB_URI)
	.then(() => { console.log("Connection Successfull") })
	.catch((err) => { console.log(err) })

  const cors = require('cors')
  const corsOption = {
      origin: ['http://localhost:3000'],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
  }
  app.use(cors(corsOption));
  
  const authRoutes = require('./routes/auth');
  
  app.use('/api/auth', authRoutes);
      