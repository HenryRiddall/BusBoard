// @ts-ignore
import express from 'express'
import { configure, getLogger } from "log4js";
import { getArrivalsNearPostcode } from "./TFLAPI";

configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const logger = getLogger("./index.ts");

const app = express()
const port = 3000

app.get('/api/departureBoards', (req, res) => {
    if (req.query.postcode) {
        getArrivalsNearPostcode(<string>req.query.postcode).then(result => {
            if (result.length < 1){
                res.status(404)
                res.send({message: "No bus stops found near that postcode"})
                logger.info(`No bus stops near ${req.query.postcode}`)
            }
            else {
                logger.info(`Request made at: ${req.query.postcode}`)
                res.send(result)
            }
        }).catch(error => {
            if (error.response && error.response.data.error){
                res.status(400)
                res.send({message: error.response.data.error})
                logger.info(error.response.data.error)
            }
            else {
                res.status(500)
                res.send({message: "An unknown error has occurred"})
                logger.warn(`Warn: ${error}`)
                console.log(error)
            }
        })
    }
    else {
        res.status(400)
        res.send({message: "Please enter a postcode"})
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/frontend', express.static('frontend'));
