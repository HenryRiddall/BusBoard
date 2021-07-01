import axios from 'axios'
import * as readlineSync  from 'readline-sync'

interface Arrival {
    timeToStation: number
    destinationName: string
    expectedArrival: string
    lineName: string
}

interface Stop {
    distance: number
    commonName: string
    id: string
}

async function requestArrivals(stopCode: string) {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_key=3850472a16334622aa04dcca7ac01b8a`)
    return response.data
}

async function getFiveSoonestArrivals(stopCode: string) {
    const arrivals: Arrival[] = await requestArrivals(stopCode)
    const sortedArrivals: Arrival[] = arrivals.sort((a: Arrival, b: Arrival) => a.timeToStation - b.timeToStation);
    return sortedArrivals.slice(0, 5)
}
function formatArrival(arrival: Arrival): string {
    return `The ${arrival.lineName} to ${arrival.destinationName} will arrive in ${Math.round(arrival.timeToStation/60)} minutes`
}

//displayFiveSoonestArrivals(readlineSync.question("Which stop would you like to find out about: "))

const postcode = "nw51tl"

async function getLatLonFromPostcode(postcode: string) {
    const response = await axios.get(`http://api.postcodes.io/postcodes/${postcode}`)
    return [response.data.result.latitude, response.data.result.longitude]
}

async function getStopPointsNearLocation(lat: number, lon: number) {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${lat}&lon=${lon}`)
    const stopPoints: Stop[] = response.data.stopPoints;
    return stopPoints.sort((a, b) => a.distance - b.distance).slice(0,2);
}

export async function getArrivalsNearPostcode(postcode: string): string {
    const [lat, lon] = await getLatLonFromPostcode(postcode);
    const stopPoints = await getStopPointsNearLocation(lat, lon);
    let result: {name: string, arrivals: Arrival[]}[] = []
    for (let stop of stopPoints) {
        const arrivals = await getFiveSoonestArrivals(stop.id);
        console.log(stop.commonName)
        console.log(arrivals.map(formatArrival).join("\n"))
    }
}
