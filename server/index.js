const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const sendMail = async (recepter) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
      user: 'noreplytodosock@gmail.com',
      pass: 'ezjx fpjz exyd ojlf'
    }
  })
  
  transporter.sendMail({
    from: 'noreplytodosock@gmail.com',
    to: recepter,
    subject: 'Convite para To Do List',
    html: 'Aceite esse convite para participar da minha lista!'
  })
  .then(message => {
    console.log(message)
  })
  .catch(error => {
    console.log(error)
  })
}

app.listen('3001', () => {
  console.log('Server is on port 3001!')
})

app.get('/lists', (req, res) => {
  console.log(req.query)
  const { recepter } = req.query
  console.log(recepter)
  if (!recepter) {
    return res.status(400).json({ error: 'Destinatário não definido' });
  }
  
  sendMail(recepter);
  res.status(200).json({ message: 'Email enviado com sucesso!' });
})