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

function extractArrival(arrival: Arrival): Arrival {
    return {    timeToStation: arrival.timeToStation,
                destinationName: arrival.destinationName,
                expectedArrival: arrival.expectedArrival,
                lineName: arrival.lineName }
}

//displayFiveSoonestArrivals(readlineSync.question("Which stop would you like to find out about: "))

async function getLatLonFromPostcode(postcode: string) {
    const response = await axios.get(`http://api.postcodes.io/postcodes/${postcode}`)
    return [response.data.result.latitude, response.data.result.longitude]
}

async function getStopPointsNearLocation(lat: number, lon: number) {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${lat}&lon=${lon}`)
    const stopPoints: Stop[] = response.data.stopPoints;
    return stopPoints.sort((a, b) => a.distance - b.distance).slice(0,2);
}
// TODO - Replace big long type with interface
export async function getArrivalsNearPostcode(postcode: string): Promise<{stopName: string, arrivals: Arrival[]}[]> {
    const [lat, lon] = await getLatLonFromPostcode(postcode);
    const stopPoints = await getStopPointsNearLocation(lat, lon);
    return Promise.all(stopPoints.map(async (stop) => {
       const arrivals = await getFiveSoonestArrivals(stop.id);
       return {stopName: stop.commonName, arrivals: arrivals.map(extractArrival)}
    }))
}
