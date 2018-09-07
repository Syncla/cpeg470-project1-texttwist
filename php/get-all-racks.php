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
    $resultsFinal = array("totalScore" => 0);
    
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
            echo "For rack $rack there are $numWords words with point value $scoreVal so total score $scoreToAdd.\n";
            
            
            if(in_array($length, array_keys($resultsFinal)))
            {
                echo "Results for length $length before: $resultsFinal[$length]\n";
                $resultsFinal[$length] += $numWords;
                echo "Results for length $length after: $resultsFinal[$length]\n";
            }
            else
            {
                
                $resultsFinal += [$length => $numWords];
                echo "Added array element with length $length with value: $resultsFinal[$length] \n";
                // Add the length as a key in our results array, with the first entry being the numWords just determined
            }
            
            $resultsFinal["totalScore"] += $scoreToAdd;
        }
        
    }
    
    print_r($resultsFinal);
}

?>