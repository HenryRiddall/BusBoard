function updateResult(postcode) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `http://localhost:3000/departureBoards?postcode=${postcode}`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function() {
        const result = JSON.parse(xhttp.response);
        document.getElementById("results").innerHTML = `
            <h2>Results</h2>
            ${result.map(stop => `<h3>${stop.stopName}</h3>
                <ul>
                    ${stop.arrivals.map(arrival => `<li>${Math.round(arrival.timeToStation/60)} minutes: ${arrival.lineName} to ${arrival.destinationName}</li>`).join("")}
                </ul>`).join("")}`;
    }

    xhttp.send();
}
