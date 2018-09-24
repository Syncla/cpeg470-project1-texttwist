<?php
    session_start();
    if (!isset($_SESSION["name"])){
        $_SESSION["name"] = "I'm the only one!";
        // its a new game
        $_SESSION["loadingFromSession"] = 0;
        $_SESSION["mainrack"] = [];
        
        $_SESSION["completedWords"] = [];
        $_SESSION["colors"] = [];
        $_SESSION["mainrackString"] = "";
        $_SESSION["scoreAndPairs"] = "";
        $_SESSION["totalScore"] = 0;
        $_SESSION["maxScore"] = 100;

    } else 
    {
        // there is already a game, no need to get a new word at the start of the game
        $_SESSION["loadingFromSession"] = 1;
    }
    
    $return = json_encode($_SESSION);
    echo($return);
?>