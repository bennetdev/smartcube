<div class="graphs">
    <div class="graph">
        <canvas id="graph_time"></canvas>
    </div>
    <div class="graph">
        <canvas id="graph_moves"></canvas>
    </div>
</div>
<script>
    var data = [];
    var labels = [];
    var data_moves = [];
    for(var i = 0; i < window.cube.solves.length; i++){
        data.push(window.cube.solves[i].time);
        labels.push(window.cube.solves[i].date);
        data_moves.push(window.cube.solves[i].moves_per_second);
    }

    var timeData = {
        labels: labels,
        datasets : [{
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointRadius: 1,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        data: data,
        spanGaps: false
    }]
    }
    var ctx = document.getElementById("graph_time").getContext("2d");
    var timeChart = new Chart(ctx, {
        type: 'line',
        data: timeData,
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Times"
            },
            legend: {
                display: false
            },
        }
    });
    var movesData = {
        labels: labels,
        datasets : [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(82,242,61,1)",
            borderColor: "rgba(82,242,61,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            pointBorderColor: "rgba(82,242,61,1)",
            pointBackgroundColor: "#fff",
            pointRadius: 1,
            pointHoverBackgroundColor: "rgba(82,242,61,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            data: data_moves,
            spanGaps: false
        }]
    }
    var ctx_moves = document.getElementById("graph_moves").getContext("2d");
    var movesChart = new Chart(ctx_moves, {
        type: 'line',
        data: movesData,
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Moves per second"
            },
            legend: {
                display: false
            },
        }
    });
</script>