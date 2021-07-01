// @ts-ignore
import express from 'express'
import { displayArrivalsNearPostcode } from "./TFLAPI";

const app = express()
const port = 3000

app.get('/departureBoards', (req, res) => {
    res.send(req.query.postcode)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})