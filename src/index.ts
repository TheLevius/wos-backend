import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/users', (req, res) => {
    res.send('Hello Users!!!!')
})
app.post('/users', (req, res) => {
    res.send('We created user!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})