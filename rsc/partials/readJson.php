<?php
    echo json_encode(file_get_contents($_FILES["file"]["tmp_name"]));