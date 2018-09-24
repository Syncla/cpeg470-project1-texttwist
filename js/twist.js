var mainrack = [];
var ansrack = [];
var completedWords = [];
var colors = [];
var mainrackString = "";
var scoreAndPairs = "";
var totalScore = 0;
var maxScore = 100;

/*
    KEEP THINGS SEPERATE
    
    ALL Graphical updates should go in the update section
    
    init should only contain function calls, nothing else
    
    php scripts should not interact with any html, only the update function should affect html
    
    update function should not change any data, it is read only
    


*/
// Needs to be dynamic?
var unfinishedWords = [];

function init() {
    // Attach the input filtering script to the text box
    capture();

    // TODO: Call PHP to get number and size of results from rack, but not words themselves

    // Get a random rack
    getRandomRack();

    // Get colors to correspond to max scors

}

function gradient(startColor, endColor, steps) {
    var start = {
        'Hex': startColor,
        'R': parseInt(startColor.slice(1, 3), 16),
        'G': parseInt(startColor.slice(3, 5), 16),
        'B': parseInt(startColor.slice(5, 7), 16)
    };
    var end = {
        'Hex': endColor,
        'R': parseInt(endColor.slice(1, 3), 16),
        'G': parseInt(endColor.slice(3, 5), 16),
        'B': parseInt(endColor.slice(5, 7), 16)
    };
    var diffR = end['R'] - start['R'];
    var diffG = end['G'] - start['G'];
    var diffB = end['B'] - start['B'];

    var stepsHex = new Array();
    var stepsR = new Array();
    var stepsG = new Array();
    var stepsB = new Array();

    for (var i = 0; i <= steps; i++) {
        stepsR[i] = start['R'] + ((diffR / steps) * i);
        stepsG[i] = start['G'] + ((diffG / steps) * i);
        stepsB[i] = start['B'] + ((diffB / steps) * i);
        stepsHex[i] = '#' + String("00" + Math.round(stepsR[i]).toString(16)).slice(-2) + '' + String("00" + Math.round(stepsG[i]).toString(16)).slice(-2) + '' + String("00" + Math.round(stepsB[i]).toString(16)).slice(-2);
    }
    return stepsHex;

}

function capture() {
    document.querySelector("#scoreValue").innerText = 0;
    document.getElementById("ans").addEventListener("keyup", function(evt) {

        var keyID = event.keyCode;
        var char = String.fromCharCode(keyID);
        char = char.toUpperCase();

        // Backspace
        if (keyID == 8) {
            if (ansrack.length > 0) {
                mainrack.push(ansrack.pop());
            }
        }
        else if (mainrack.includes(char)) {
            ansrack.push(char);
            var idx = mainrack.indexOf(char);
            mainrack.splice(idx, 1);
        }
        else if (keyID == 13) {
            console.log("Enter");
            if (ansrack.length > 0) {
                checkAns();
            }
        }
        update();
    });
}

function getRandomRack() {
    // Get rack of random size
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            let rack = JSON.parse(this.response);
            //var table = document.getElementById("rack-storage").getElementsByTagName("tbody")[0];


            // is this acceptable?
            mainrackString = rack;
            console.log(mainrackString);
            for (var i = 0; i < rack.length; i++) {
                mainrack.push(rack[i]);
            }
            // TODO: This was my solution to ensure getRandomRack finishes first before getting the answer scope
            getAnswerScope();
            update();
        }
    };
    xhr.open("GET", "./php/random-rack.php");
    xhr.send();
}

function newWord() {
    // Get current score
    var score = totalScore;
    // Clear the racks
    var mainLen = mainrack.length;
    var ansLen = ansrack.length;
    for (var i = 0; i < mainLen; i++) {
        mainrack.pop()
    }
    for (var i = 0; i < ansLen; i++) {
        ansrack.pop()
    }
    getRandomRack();

}


function getAnswerScope() {

    // Get number and size of results, plus max Score



    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            console.log(this.response);
            scoreAndPairs = JSON.parse(this.response);


            console.log(scoreAndPairs["totalScore"]);
            // New max score is equal to the current score plus the max from the new words, that will account for changing words
            maxScore = totalScore + scoreAndPairs["totalScore"];

            colors = gradient("#ff0000", "#00FF00", maxScore);
            console.log(mainrackString.length);

            update();
        }
    };
    console.log(mainrackString);
    xhr.open("GET", "./php/get-answer-scope.php?inputRack=" + mainrackString);
    xhr.send();
}

function checkAns() {
    var ans = ansrack.join("");
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            // Right now it is an array of JSON objects it looks like, should change it to be a single JSON object if possible.
            let check = JSON.parse(this.response);
            if (check['exists'] == 1) {
                // an index of -1 means it is NOT present in the array
                if (completedWords.indexOf(ans) == -1) {
                    // add ans to completed words
                    completedWords.push(ans);
                    completedWords.sort(function(a, b) {
                        return (a.length - b.length) || a.localeCompare(b); // sort by dictionary order
                    });
                    console.log("YAYYY");

                    //TODO: Handle score
                    totalScore += parseInt(parseInt(check['weight']));

                    // Clear the answer rack for correct answers
                    var len = ansrack.length;
                    scoreAndPairs[len]--;
                    for (var i = 0; i < len; i++) {
                        mainrack.push(ansrack.pop());
                    }
                }
                else {
                    // do nothing if the word is already present (maybe notify user?)
                    console.log("Already answered that!");
                }
                // We need this because the call is asynchronous it seems?

            }
            else {
                console.log("NOES");
            }
            update();
        }
    };
    xhr.open("GET", "./php/check-if-word.php?ans=" + ans);
    xhr.send();
}

function update() {

    // Update the mainrack and ansrack for new keypresses
    var racktable = document.getElementById("rack-storage").getElementsByTagName("tbody")[0];
    if (racktable.rows.length > 0) {
        racktable.deleteRow(0);
    }
    var row = racktable.insertRow(0);
    for (var i = 0; i < mainrack.length; i++) {
        var char = document.createTextNode("char");
        var letter = row.insertCell(-1);
        // Add the letters
        char.textContent = mainrack[i];
        letter.appendChild(char);
        letter.setAttribute("class", "mainrack");
    }
    document.getElementById("ans").value = "";
    var msg = "";
    for (var i = 0; i < ansrack.length; i++) {
        msg += ansrack[i];
    }
    document.getElementById("ans").value = msg;

    // Update the score section, setting color and bar percentage
    document.querySelector("#scoreValue").innerText = String(totalScore);
    var color = colors[totalScore];
    document.getElementById("scoreValue").style.color = color;
    var bar = document.getElementById("score-bar");
    var percentage = (totalScore / maxScore) * 100;
    bar.style.width = percentage + '%';
    bar.style.backgroundColor = color;

    //Update words left
    var info = document.getElementById("ans-info");
    info.innerHTML = "";
    for (var answerLength = 2; answerLength <= mainrackString.length; answerLength++) {
        if (scoreAndPairs[answerLength]) {
            info.innerHTML += `<tr><td class="ans-cell">${answerLength}</td><td class="ans-cell">${scoreAndPairs[answerLength]}</td></tr>`;
        }
    }


    // Update completed words section
    // Super inefficient, but it works
    // This is some clever code. Haha.
    var maxCols = 15;
    var completeTable = document.getElementById("completed-words");
    // Remove all the contents of the completed words table
    completeTable.innerHTML = "";
    var newHTML = "<tr>";
    for (var i = 0; i < completedWords.length; i++) {
        if (i % maxCols == 0 && i != 0) {
            newHTML += "</tr>";
            if (i + 1 < completedWords.length) {
                newHTML += "<tr>";
            }
        }
        newHTML += `<td class="ans-cell"> ${completedWords[i]}</td>`;
    }
    completeTable.innerHTML = newHTML;
    //for (var i = 0; i <completedWords.length;i++){

    //}
}

function cheat() {
    alert("Cheater.")
    var win = window.open("https://wordunscrambler.me/", '_blank');
    win.focus();
    totalScore = -9001;
    update();
}


