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
    <script src="js/libs/Chart.min.js"></script>
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
        <div id="solve_moves"></div>
        <p id="solve_scramble"></p>
        <p id="solve_date"></p>
    </div>
</div>
<div id="appbar">
    <span class="material-icons md-48 connect">bluetooth</span>
    <p id="scramble"></p>
    <div class="float_right">
        <a href="rsc/partials/timer.php" class="material-icons md-48 timer_page">history</a>
        <a href="rsc/partials/stats.php" class="material-icons md-48 stat_page">leaderboard</a>
        <span class="material-icons md-48 reset">restart_alt</span>
    </div>
</div>
<div class="container">
    <?php include "rsc/partials/timer.php" ?>
</div>
</body>
</html>