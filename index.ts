import axios from 'axios'
import * as readlineSync  from 'readline-sync'

interface Arrival {
    timeToStation: number
    destinationName: string
    expectedArrival: string
    lineName: string
}

async function requestArrivals(stopCode: string) {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_key=3850472a16334622aa04dcca7ac01b8a`)
    return response.data
}

function getFiveSoonestArrivals(arrivals: Arrival[]): Arrival[] {
    const sortedArrivals: Arrival[] = arrivals.sort((a: Arrival, b: Arrival) => a.timeToStation - b.timeToStation);
    return sortedArrivals.slice(0, 5)
}
function formatArrival(arrival: Arrival): string {
    return `The ${arrival.lineName} to ${arrival.destinationName} will arrive in ${Math.round(arrival.timeToStation/60)} minutes`
}

async function displayFiveSoonestArrivals(stopCode: string){
    const arrivals: Arrival[] = await requestArrivals(stopCode)
    console.log(getFiveSoonestArrivals(arrivals).map(formatArrival).join("\n"))
}

displayFiveSoonestArrivals(readlineSync.question("Which stop would you like to find out about: "))