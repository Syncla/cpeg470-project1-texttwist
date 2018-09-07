<?php
//TODO: Make sure there is only one argument
function get_all_racks($myrack)
{
    $racks = [];
    for($i = 0; $i < pow(2, strlen($myrack)); $i++){
    	$ans = "";
    	for($j = 0; $j < strlen($myrack); $j++){
    		//if the jth digit of i is 1 then include letter
    		if (($i >> $j) % 2) {
    		  $ans .= $myrack[$j];
    		}
    	}
    	if (strlen($ans) > 1){
      	    $racks[] = $ans;	
    	}
    }
    $racks = array_unique($racks);
    //print_r($racks);
    return $racks;
}

/*
This function will return the number of answers that are expected.

The return is of the form:

{"1":"15", "3":"12", "5":"20"}

for 15 1 letter words, 12 3 letter words, 20 5 letter words, for example.

*/
// TODO :
// Get max score possible, will do fun things with this
function get_answer_scope($inputRack)
{
    $allRacks = get_all_racks($inputRack);
    
    // Should be of the form of the return type.
    $results = array("totalScore" => 0);
    
    $totalScore = 0;
    
    
    
    foreach($allRacks as $rack)
    {
        //echo $rack;
        //echo "\n";
        $length = strlen($rack);
        
        
        // Number of words for this rack
        $numWords = 0;
        
        // Score value for words in this rack
        $scoreVal = 0;
        
        // TODO: Querry for the number of words and the weight for said words
        
        $dbhandle = new PDO("sqlite:scrabble.sqlite") or die("Failed to open DB");
        
        if (!$dbhandle) die ($error);
        $query = "SELECT words, weight FROM racks WHERE rack = '$rack'";
        
        $statement = $dbhandle->prepare($query);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);
        
        //echo "The raw results: \n";
        //print_r($results);
        
        $words = $results[0]['words'];
        
        $wordsArray = explode("@@", $words);
        
        //echo "The words array: \n";
        //print_r($wordsArray);
        
        $numWords = count($wordsArray);
        
        $scoreVal = $results[0]['weight'];
        
        //echo "The weight value: \n";
        //print($scoreVal);
        
        
        
        $scoreToAdd = $numWords * $scoreVal;
        
        // The weight existing is a gurantee that the querry was succesful and returned words
        if($scoreVal)
        {
            echo "For rack $rack there are $numWords words with point value $scoreVal so total score $scoreToAdd.\n\n";
            
            if(in_array($length, array_keys($results)))
            {
                echo "Results for length $length before: $results[$length]";
                $results[$length] += $numWords;
                echo "Results for length $length after: $results[$length]";
            }
            else
            {
                
                // Add the length as a key in our results array
            }
        }
        
        
        //$results = $results[0]['rack'];
        
        
        // Set numWords to the appropriate value
        
        if($numWords != 0 && in_array($length, array_keys($results)))
        {
            // increment value by 1 for this key
        }
        else
        {
            // add key and set value to 1
        }
    }
}

?>