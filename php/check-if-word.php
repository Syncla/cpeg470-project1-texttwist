<?php

/*
Is a very straightforward call. Just check to see if the specified
guess is in the database at all and return true if it is and false
if it is not.
*/
function check_if_word($guess)
{
    // get all of the racks to check against our guess
    /*
    $allRacks = get_all_racks($rack);
    
    foreach($allRacks as $rack)
    {
        //echo $rack;
        
        
        if(strlen($rack) == strlen($guess))
        {
            $dbhandle = new PDO("sqlite:scrabble.sqlite") or die("Failed to open DB");
            if (!$dbhandle) die ($error);
            
            echo "SELECT words FROM racks WHERE rack = '$rack' AND words LIKE '$guess';";
            echo "\n";
            $query = "SELECT words FROM racks WHERE rack = '$rack' AND words LIKE '$guess';";
            
            $statement = $dbhandle->prepare($query);
            $statement->execute();
            $results  = $statement->fetchAll(PDO::FETCH_ASSOC);
            
            if($results)
            {
                echo "found a thing";
            }
        }
    }
    */
    $dbhandle = new PDO("sqlite:scrabble.sqlite") or die("Failed to open DB");
    if (!$dbhandle) die ($error);
    
    //echo "SELECT words FROM racks WHERE words LIKE '%$guess%'";
    //echo "\n";
    $len = strlen($guess);
    $query = "SELECT words,weight FROM racks WHERE words LIKE '%$guess%' and length = '$len';";
    
    $statement = $dbhandle->prepare($query);
    $statement->execute();
    $results  = $statement->fetchAll(PDO::FETCH_ASSOC);
    $return = new \stdClass();
    if($results)
    {
        $return->exists = "1";    
        $return->weight = $results[0]['weight'];    
        return json_encode($return);
        //echo "The word exists! :)\n";
        //return 1;
    }
    $return->exists = "0";    
    $return->weight = 0;    
    return json_encode($return);
    //echo "The word does not exist! :(\n";
    //return 0;

}
echo check_if_word($_GET["ans"]);
?>