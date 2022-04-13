const BACKEND_HOST = "http://127.0.0.1:8000/"

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect("/login.html")
})

app.get("/:shortUrl", (req, res) => {
    res.redirect(BACKEND_HOST + req.params.shortUrl)
})

app.listen(3000);
console.log("Server started at 3000");