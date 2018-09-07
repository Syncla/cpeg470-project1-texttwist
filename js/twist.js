var mainrack = [];
var ansrack = [];
var completedWords = [];
var colors = [];
var totalScore = 0;

function init() {

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
    // TODO: Call PHP script to get random rack of certain size

    // TODO: Call PHP to get number and size of results from rack, but not words themselves

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            let rack = JSON.parse(this.response);
            //var table = document.getElementById("rack-storage").getElementsByTagName("tbody")[0];
            for (var i = 0; i < rack.length; i++) {
                mainrack.push(rack[i]);
            }
            update();
        }
    };
    xhr.open("GET", "./php/random-rack.php");
    xhr.send();



    colors = gradient("#ff0000","#00FF00",100);
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

                    console.log("YAY");

                    //TODO: Handle score
                    totalScore += parseInt(parseInt(check['weight']));
                    var color = colors[totalScore];
                    document.getElementById("scoreValue").style.color = color;
                    var bar = document.getElementById("score-bar");
                    if (totalScore<=100){
                        bar.style.width = totalScore+'%';
                        bar.style.color = color;
                    }
                    // Better way to do this?

                    // Clear the answer rack for correct answers
                    var len = ansrack.length;
                    for (var i = 0; i < len; i++) {
                        mainrack.push(ansrack.pop());
                    }
                }
                else {
                    // do nothing if the word is already present (maybe notify user?)
                    console.log("Already answered that!");
                }
                // We need this because the call is asynchronous it seems?
                update();
            }
            else {
                console.log("NOES");
            }
        }
    };
    xhr.open("GET", "./php/check-if-word.php?ans=" + ans);
    xhr.send();
}

function update() {
    var table = document.getElementById("rack-storage").getElementsByTagName("tbody")[0];
    if (table.rows.length > 0) {
        table.deleteRow(0);
    }
    var row = table.insertRow(0);
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

    document.querySelector("#scoreValue").innerText = String(totalScore);

    document.querySelector("#answers-toString").innerText = completedWords.toString();

}
