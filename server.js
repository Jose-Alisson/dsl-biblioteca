const express = require('express')
const app = express()

app.use(express.static(__dirname + "/dist/ps-angular"))

app.get("/**", (req, res) => {
  res.sendFile(__dirname + "/dist/ps-angular/server/index.html")
})

const port = process.env.PORT || 4202

app.listen(4202, () => {
  console.log("Iniciou na porta: " + port)
})
