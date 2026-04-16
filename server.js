const express = require('express')
const path = require('path')
require("dotenv").config()


const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const { auth } = require('express-openid-connect');

app.use(auth({
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
}));

app.use((req, res, next) => {
    res.locals.user = req.oidc.user;
    next();
});


var indexRouter = require("./routes/index.js")
app.use("/", indexRouter)



const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = process.env.PORT || 3000;
const hostname = externalUrl ? '0.0.0.0' : 'localhost';

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  if (externalUrl) console.log(`Externally accessible at ${externalUrl}`);
});