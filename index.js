import {connect} from './js/libs/index.js';

class Solve{
    constructor(date, id) {
        this.id = id;
        this.moves = [];
        this.scramble = [];
        this.time = 0;
        this.date = date;
        this.cross_solved_stage = {
            index: -1,
            time: -1
        };
        this.f2l_solved_stage = {
            index: -1,
            time: -1
        };
        this.oll_solved_stage = {
            index: -1,
            time: -1
        };
        this.pll_solved_stage = {
            index: -1,
            time: -1
        }
    }
    get move_number(){
        return this.moves.length;
    }
    get moves_per_second(){
        return Math.round(this.move_number / round_to_3(this.time) * 100) / 100
    }
    get cross_moves(){
        return this.moves.slice(0, this.cross_solved_stage.index + 1);
    }
    get f2l_moves(){
        return this.moves.slice(this.cross_solved_stage.index + 1, this.f2l_solved_stage.index + 1);
    }
    get oll_moves(){
        return this.moves.slice(this.f2l_solved_stage.index + 1, this.oll_solved_stage.index + 1);
    }
    get pll_moves(){
        return this.moves.slice(this.oll_solved_stage.index + 1, this.pll_solved_stage.index + 1);
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

    get oll_solved(){
        return this.giiker.stateString.slice(27,36) === "DDDDDDDDD";
    }

    get cross_solved() {
        return this.giiker.stateString[1] === "U" && this.giiker.stateString[3] === "U" && this.giiker.stateString[5] === "U" && this.giiker.stateString[7] === "U";
    }

    get f2l_solved(){
        var f2l_string = this.giiker.stateString.slice(0, 15) + this.giiker.stateString.slice(18, 24) + this.giiker.stateString.slice(36, 42) + this.giiker.stateString.slice(45, 51);
        return f2l_string === "UUUUUUUUURRRRRRFFFFFFLLLLLLBBBBBB";
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

    delete_solve_by_id(id){
        for (var i = 0; i < this.solves.length; i++) {
            if (this.solves[i].id === id) {
                this.solves.splice(i,1);
                break;
            }
        }
    }
    get next_id(){
        if(cube.solves.length === 0){
            return 0;
        }
        else{
            return cube.solves[cube.solves.length - 1].id + 1;
        }
    }
    set_scramble(new_scramble){
        this.scramble_index = 0;
        this.scramble = [...new_scramble];
        this.current_solve.scramble = [...new_scramble];
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
        var abbruch = this.solves.length - limit;
        if (this.solves.length - limit <= 0) {
            abbruch = 0;
        }
        var sum = 0;
        for (var i = this.solves.length - 1; i >= abbruch; i--) {
            sum += this.solves[i].time / 1000;
        }
        return Math.round(sum / (abbruch === 0 ? this.solves.length : limit) * 100) / 100;
    }

    get_top_mps(){
        var mps = 0;

        for (var i = 0; i < this.solves.length; i++) {
            if(mps === 0 || this.solves[i].moves_per_second > mps){
                mps = this.solves[i].moves_per_second;
            }
        }
        return mps;
    }

    get_top_solve(){
        var time = 0;

        for (var i = 0; i < this.solves.length; i++) {
            if(time === 0 || this.solves[i].time < time){
                time = this.solves[i].time;
            }
        }
        return Math.round(time / 10) / 100;
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
async function get_url(url){
    const response = await fetch("partials/" + url);
    return await response.text();
}
function get_today(){
    var today = new Date();
    return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
}

function refresh_solves(cube) {
    $("#history").html("<tr><th>Date</th><th>Time</th><th>Scramble</th></tr>");
    for (var i = 0; i < cube.solves.length; i++) {
        render_solve(cube.solves[i]);
    }
}
function render_solve(solve){
    var row = "<tr class='solve' id='" + solve.id + "'><td>" + solve.date + "</td><td>" + round_to_3(solve.time) + "</td><td>" + solve.scramble.join(" ") + "</td></tr>"
    $("#history").append(row);
}
function add_solve(solve, cube) {
    solve.time = stopwatch.time();
    cube.solves.push(solve);
    render_solve(solve);
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
function update_stats(cube){
    $("#stats").html("Top: " + cube.get_top_solve() + " MpS: " + cube.get_top_mps());
}
function round_to_3(number){
    return Math.round(number) / 1000
}
function close_modal(){
    $("#solve_modal").css("display", "none");
}
async function get_json_by_file(file){
    var formdata = new FormData();
    formdata.append("file", file)
    const result = await fetch("rsc/partials/readJson.php", {
        method: "POST", body: formdata
    });
    return result.json();
}

async function save_to_session(cube){
    var formdata = new FormData();
    formdata.append("solves", get_json_solves())
    await fetch("rsc/partials/session.php", {
        method: "POST", body: formdata
    });
}

function load_json(json){
    var solves = json;
    for (var i = 0; i < solves.length; i++){
        var solve = new Solve(solves[i].date, cube.next_id);
        solve.moves = solves[i].moves;
        solve.time = solves[i].time;
        solve.scramble = solves[i].scramble;
        solve.cross_solved_stage = solves[i].cross_solved_stage;
        solve.f2l_solved_stage = solves[i].f2l_solved_stage;
        solve.oll_solved_stage = solves[i].oll_solved_stage;
        solve.pll_solved_stage = solves[i].pll_solved_stage;
        cube.solves.push(solve);
    }
    refresh_solves(cube);
    update_avg(cube);
    update_stats(cube);
}
function get_json_solves(){
    return JSON.stringify(cube.solves);
}
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

const stopwatch = new Stopwatch();
var current_solve_id = -1;

function on_move(cube, move){
    console.log(stopwatch.get_running());
    if(!stopwatch.get_running()){
        if(cube.scramble_index === cube.scramble.length){
            if(stopwatch.time() !== 0){
                stopwatch.reset();
            }
            stopwatch.start();
            cube.current_solve.moves.push(move.notation);
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
        cube.current_solve.moves.push(move.notation);
        cube.current_solve.pll_solved_stage.index = cube.current_solve.move_number - 1;
        cube.current_solve.pll_solved_stage.time = stopwatch.time();
        cube.current_solve.id = cube.next_id;
        add_solve(cube.current_solve, cube);
        update_avg(cube);
        update_stats(cube);
        cube.current_solve = new Solve(get_today(), cube.next_id);
        cube.generate_scramble();
        render_scramble(cube);
        save_to_session(cube).then(console.log("saved"));
    }
    else{
        cube.current_solve.moves.push(move.notation);
        if(cube.current_solve.cross_solved_stage.index === -1 && cube.cross_solved){
            cube.current_solve.cross_solved_stage.index = cube.current_solve.move_number - 1;
            cube.current_solve.cross_solved_stage.time = stopwatch.time();
        }
        if(cube.current_solve.f2l_solved_stage.index === -1 && cube.f2l_solved){
            cube.current_solve.f2l_solved_stage.index = cube.current_solve.move_number - 1;
            cube.current_solve.f2l_solved_stage.time = stopwatch.time();
        }
        if(cube.current_solve.oll_solved_stage.index === -1 && cube.oll_solved){
            cube.current_solve.oll_solved_stage.index = cube.current_solve.move_number - 1;
            cube.current_solve.oll_solved_stage.time = stopwatch.time();
        }
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
    load_json(autosave);
});
$(".reset").click(function (){
    cube.giiker.resetState();
})
$("#history").on("click", ".solve",function (){
    $("#solve_modal").css("display", "block");
    var id = parseInt($(this).attr("id"));
    current_solve_id = id;
    console.log(id);
    var solve = cube.get_solve_by_id(id);
    console.log(cube, solve, cube.solves)
    $("#solve_time").html(round_to_3(solve.time));
    $("#solve_moves_number").html(solve.move_number + " moves, " + solve.moves_per_second + " moves per second");
    $("#solve_date").html(solve.date);
    if(solve.cross_solved_stage.index === -1){
        $("#solve_moves").html("<p>" + solve.moves.join(" ") + "</p>");
    }
    else{
        $("#solve_moves").html(
            "<h4>Cross: " + round_to_3(solve.cross_solved_stage.time) +"s</h4><br>" + solve.cross_moves.join(" ") + "<hr/>" +
            "<h4>F2L: " + round_to_3(solve.f2l_solved_stage.time) +"s</h4><br>" + solve.f2l_moves.join(" ") + "<hr/>" +
            "<h4>OLL: " + round_to_3(solve.oll_solved_stage.time) +"s</h4><br>" + solve.oll_moves.join(" ") + "<hr/>" +
            "<h4>PLL: " + round_to_3(solve.pll_solved_stage.time) +"s</h4><br>" + solve.pll_moves.join(" ") + "<hr/>"
        );
    }
    $("#solve_scramble").html(solve.scramble.join(" "));
});
$(".delete_solve").click(function (){
    var id = current_solve_id;
    cube.delete_solve_by_id(id);
    refresh_solves(cube);
    update_avg(cube);
    close_modal();
});
$(".copy_scramble").click(function (){
    var id = current_solve_id;
    cube.set_scramble(cube.get_solve_by_id(id).scramble);
    render_scramble(cube);
    close_modal();
});
$(".close_modal").click(function (){
    close_modal()
});
$("#file").change(function () {
    get_json_by_file($("#file").prop("files")[0]).then((response) => load_json(JSON.parse(response)));
})
$("#download").click(function () {
    download("solves.json", get_json_solves())
})
