import {connect} from '../smartcube/js/libs/index.js';

class Solve{
    constructor(date, id) {
        this.id = id;
        this.moves = [];
        this.scramble = [];
        this.time = 0;
        this.date = date;
    }
    to_json(){
        return {
            date: get_today(),
            time: stopwatch.time() / 1000,
            scramble: this.scramble.join(" "),
            moves: this.moves
        };
    }
    get move_number(){
        return this.moves.length;
    }
}

class Cube {
    static moves = ["U", "F", "L", "R", "D", "B"];
    static scramble_len = 21;

    constructor(giiker) {
        this.giiker = giiker;
        this.solves = [];
        this.scramble = [];
        this.current_solve = new Solve(get_today(), 0);
        this.generate_scramble();

    }

    get solved() {
        return this.giiker.stateString === "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
    }

    get_solve_by_id(id) {
        for (var i = 0; i < this.solves.length; i++) {
            if (this.solves[i].id === id) {
                return this.solves[i];
            }
        }
        return null
    }

    generate_scramble() {
        this.scramble_index = 0;
        var scramble = [];
        var scramble_backup = [];
        var last_move = "";
        for (var i = 0; i < Cube.scramble_len; i++) {
            do {
                var move = Cube.moves[Math.floor(Math.random() * Cube.moves.length)];
            } while (last_move === move);
            last_move = move;
            var prime_rdm = Math.random();
            if (prime_rdm < 0.5) {
                move += "'";
            }
            /*            var two_random = Math.random();
                        if(two_random < 0.5){
                            move = "2" + move;
                        }*/
            scramble.push(move);
            scramble_backup.push(move);
        }
        this.scramble = scramble;
        this.current_solve.scramble = scramble_backup;
    }

    get_average() {
        var sum = 0;
        for (var i = 0; i < this.solves.length; i++) {
            sum += this.solves[i].time / 1000;
        }
        return Math.round(sum / this.solves.length * 100) / 100;
    }

    get_average_on_limit(limit) {
        var abbruch = this.solves.length - (limit + 1);
        if (this.solves.length - limit <= 0) {
            abbruch = 0;
        }
        var sum = 0;
        for (var i = this.solves.length - 1; i >= abbruch; i--) {
            sum += this.solves[i].time / 1000;
        }
        return Math.round(sum / (abbruch === 0 ? this.solves.length : limit) * 100) / 100;
    }
}
var Stopwatch = function (){
    var offset;
    var interval;
    var time = 0;
    var running = false;

    function start_timer(){
        running = true;
        offset = Date.now();
        interval = setInterval(update_timer, 10)
    }
    function stop_timer(){
        console.log("stopped")
        running = false;
        clearInterval(interval);
        interval = null;
    }
    function reset(){
        time = 0;
        render();
    }
    function update_timer(){
        var now = Date.now();
        time += now - offset;
        offset = now
        render();
    }
    function render(){
        $("#timer").html(Math.round(time/10) / 100);
    }
    function get_running(){
        return running;
    }
    function get_time(){
        return time;
    }

    this.reset = reset;
    this.get_running = get_running;
    this.start = start_timer;
    this.stop = stop_timer;
    this.time = get_time;
}
function get_today(){
    var today = new Date();
    return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
}


function add_solve(solve, cube) {
    solve.time = stopwatch.time();
    cube.solves.push(solve);
    var row = "<tr class='solve' id='" + solve.id + "'><td>" + solve.date + "</td><td>" + round_to_3(solve.time) + "</td><td>" + solve.scramble.join(" ") + "</td></tr>"
    $("#history").append(row);
}

function render_scramble(cube){
    console.log("rendered");
    $("#scramble").html(cube.scramble.join(" "));
}
function reverse_notation(notation){
    if(notation.includes("'")){
        return notation.substring(0, notation.length - 1);
    }
    else{
        return notation + "'";
    }
}
function update_avg(cube){
    $("#avg").html("Avg " + cube.get_average() + " AO3 " + cube.get_average_on_limit(3) + " AO5 " + cube.get_average_on_limit(5));
}
function round_to_3(number){
    return Math.round(number) / 1000
}

const stopwatch = new Stopwatch();


function on_move(cube, move){
    console.log(stopwatch.get_running());
    console.log(cube.solved);
    if(!stopwatch.get_running()){
        if(cube.scramble_index === cube.scramble.length){
            if(stopwatch.time() !== 0){
                stopwatch.reset();
            }
            stopwatch.start();
        }
        else{
            console.log(cube.scramble[cube.scramble_index], move.notation, move.notation === cube.scramble[cube.scramble_index])
            if(cube.scramble[cube.scramble_index] === move.notation){
                cube.scramble[cube.scramble_index] = "/";
                cube.scramble_index++;
            }
            else{
                cube.scramble.splice(cube.scramble_index, 0, reverse_notation(move.notation))
            }
            render_scramble(cube);
        }
    }
    else if(cube.solved){
        stopwatch.stop();
        add_solve(cube.current_solve, cube);
        update_avg(cube);
        cube.current_solve = new Solve(get_today(), cube.solves[cube.solves.length - 1].id + 1);
        cube.generate_scramble();
        render_scramble(cube);
    }
    else{
        cube.current_solve.moves.push(move.notation);
    }
}
$(".connect").click(async () => {

    const giiker = await connect();
    const cube = new Cube(giiker)
    render_scramble(cube);
    giiker.on('move', (move) => {
        on_move(cube, move);
    });
    $(".connect").html("bluetooth_disabled");
    // Expose giiker object for testing on console
    window.giiker = giiker;
    window.cube = cube;
});
$("#history").on("click", ".solve",function (){
    $("#solve_modal").css("display", "block");
    var id = parseInt($(this).attr("id"));
    console.log(id);
    var solve = cube.get_solve_by_id(id);
    console.log(cube, solve, cube.solves)
    $("#solve_time").html(round_to_3(solve.time));
    $("#solve_moves_number").html(solve.move_number + " moves, " + Math.round(solve.move_number / round_to_3(solve.time) * 100) / 100 + " moves per second");
    $("#solve_date").html(solve.date);
    $("#solve_moves").html(solve.moves.join(" "));
    $("#solve_scramble").html(solve.scramble.join(" "));
});
$(".close_modal").click(function (){
   $("#solve_modal").css("display", "none");
});
