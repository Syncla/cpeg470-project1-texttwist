<?php
    $sess = json_decode(file_get_contents('php://input'), true);
   
    session_start();
    $_SESSION["name"] = $sess['name'];
    // its a new game
    $_SESSION["loadingFromSession"] = $sess['loadingFromSession'];
    $_SESSION["mainrack"] = $sess['mainrack'];
        
    $_SESSION["completedWords"] = $sess['completedWords'];
    $_SESSION["mainrackString"] = $sess['mainrackString'];
    $_SESSION["scoreAndPairs"] = $sess['scoreAndPairs'];
    $_SESSION["totalScore"] = $sess['totalScore'];
    $_SESSION["maxScore"] = $sess['maxScore'];

    
    $return = json_encode($_SESSION);
    echo($return);
?>