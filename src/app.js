const express = require('express')
const app = express()

const PORT = process.env.PORT ?? 5000

// Health route
app.get('/ping', (_, res) => {
    res.send({ status: 'OK', data: 'pong' })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})