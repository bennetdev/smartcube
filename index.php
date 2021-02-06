<?php
    session_start();
    if(isset($_SESSION["solves"])){
        $autosave = $_SESSION["solves"];
    }
    else{
        $autosave = [];
    }
?>
<script>
    const autosave = <?php echo $autosave ?>;
    window.autosave = autosave;
</script>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>SmartCube</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script type="module" src="index.js" defer charset="utf-8"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="rsc/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            text-align: center;
        }

        button {
            margin: 1em 0;
        }
    </style>
</head>
<body>
<div class="modal" id="solve_modal" style="display: none">
    <div class="modalContent">
        <div class="modalHeader">
            <span class="material-icons md-48 close_modal">close</span>
            <span class="material-icons md-48 delete_solve">delete</span>
            <span class="material-icons md-48 copy_scramble">content_copy</span>
        </div>
        <h1 id="solve_time">00.00</h1>
        <p id="solve_moves_number">0</p>
        <p id="solve_moves"></p>
        <p id="solve_scramble"></p>
        <p id="solve_date"></p>
    </div>
</div>
<div id="appbar">
    <span class="material-icons md-48 connect">bluetooth</span>
    <p id="scramble"></p>
    <span class="material-icons md-48 reset">restart_alt</span>
</div>
<div class="container">
    <p id="timer">00.00</p>
    <p id="avg">Avg 00.00 AO3 00.00 AO5 00.00</p>
    <p id="stats">Top: 00.00 MpS: 0</p>
    <div id="history_wrapper">
        <table id="history">
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Scramble</th>
            </tr>
        </table>
    </div>
    <div class="floating-action-button">
        <div>
            <span class="material-icons md-3" id="download">download</span>
        </div>
        <div>
            <label for="file" class="material-icons md-3" id="upload">upload</label>
            <input type="file" name="file" id="file">
        </div>
    </div>
</div>
</body>
</html>