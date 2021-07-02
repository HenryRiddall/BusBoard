function add(a, b) {
    return {bayCount: a.bayCount + b.bayCount, free: a.free + b.free, occupied: a.occupied + b.occupied};
}

function getBaysData(carpark) {
    return carpark.bays.reduce((result, current) => add(result, {
        bayCount: current.bayCount,
        free: current.free,
        occupied: current.occupied
    }), {bayCount: 0, free: 0, occupied: 0})
}

function sumResults(results) {
    return results.reduce((result, current) => add(result, getBaysData(current)), {bayCount: 0, free: 0, occupied: 0});
}

function updateResult() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `/api/carParks`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function () {
        const result = JSON.parse(xhttp.response)
        drawChart(result);
    }

    xhttp.send();
}

function twoPad(str) {
    return ("0" + str).slice(-2)
}

function displayDate(dateStr) {
    const date = new Date(dateStr);
    return `${twoPad(date.getDate())}/${twoPad(date.getMonth() + 1)}/${date.getFullYear()} - ${twoPad(date.getHours())}:${twoPad(date.getMinutes())}`
}

function drawChart(data) {
    console.log(data);
    var dataTable = google.visualization.arrayToDataTable([
        ['Time', 'Free Bays', 'Occupied Bays']
    ].concat(data.map((dataPoint) => [displayDate(dataPoint.dateTime), dataPoint.free, dataPoint.occupied])));

    var options = {
        title: 'Car park data',
        hAxis: {title: 'Time', titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0},
        pointSize: 5,
        backgroundColor: "#FFFFEE",
        hAxis: {
            slantedText: false,
            maxAlternation: 1
        }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(dataTable, options);
}

google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(() => {
    updateResult()
    setInterval(updateResult, 10000)
});
