function updateResult(postcode) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `/api/departureBoards?postcode=${postcode}`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function() {
        const result = JSON.parse(xhttp.response);
        if (result.message) {
            document.getElementById("results").innerHTML = `
            <h2>Results</h2>
            <p>Error: ${result.message}</p>
            `;
        } else {
            document.getElementById("results").innerHTML = `
            <h2>Results</h2>
            ${result.map(stop => `<h3>${stop.stopName}</h3>
                <ul>
                    ${stop.arrivals.map(arrival => `<li>${Math.round(arrival.timeToStation / 60)} minutes: ${arrival.lineName} to ${arrival.destinationName}</li>`).join("")}
                </ul>`).join("")}`;
        }
    }

    xhttp.send();
}

let interval = null;

function updatePostcode(postcode) {
    updateResult(postcode);
    if (interval !== null) clearInterval(interval);
    interval = setInterval(() => updateResult(postcode), 30 * 1000);
}
