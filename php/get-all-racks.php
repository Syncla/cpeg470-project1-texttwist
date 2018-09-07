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
    $results = array();
    
    
    
    foreach($allRacks as $rack)
    {
        //echo $rack;
        $length = strlen($rack);
        
        
        // Get the number of words for this rack
        $numWords = 0;
        
        if($numWords != 0 && in_array($length, array_keys($results)))
        {
            // increment value by 1 for this key
        }
        else
        {
            // add key and set value to 1
        }
        
        
}




?>