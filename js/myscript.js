// File: myscript.js
// GUI Assignment: HW5 Scrabble
//     Create a mini version of the game Scrabble
// Sofya Chow, Sofya_Chow@student.uml.edu
// Last Updated On: December 15, 2021       

// Array to hold tile data
var ScrabbleTiles = [];
ScrabbleTiles["A"] = { "value": 1, "original-distribution": 9, "number-remaining": 9, "image": "images/Scrabble_Tile_A.jpg" };
ScrabbleTiles["B"] = { "value": 3, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_B.jpg" };
ScrabbleTiles["C"] = { "value": 3, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_C.jpg" };
ScrabbleTiles["D"] = { "value": 2, "original-distribution": 4, "number-remaining": 4, "image": "images/Scrabble_Tile_D.jpg" };
ScrabbleTiles["E"] = { "value": 1, "original-distribution": 12, "number-remaining": 12, "image": "images/Scrabble_Tile_E.jpg" };
ScrabbleTiles["F"] = { "value": 4, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_F.jpg" };
ScrabbleTiles["G"] = { "value": 2, "original-distribution": 3, "number-remaining": 3, "image": "images/Scrabble_Tile_G.jpg" };
ScrabbleTiles["H"] = { "value": 4, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_H.jpg" };
ScrabbleTiles["I"] = { "value": 1, "original-distribution": 9, "number-remaining": 9, "image": "images/Scrabble_Tile_I.jpg" };
ScrabbleTiles["J"] = { "value": 8, "original-distribution": 1, "number-remaining": 1, "image": "images/Scrabble_Tile_J.jpg" };
ScrabbleTiles["K"] = { "value": 5, "original-distribution": 1, "number-remaining": 1, "image": "images/Scrabble_Tile_K.jpg" };
ScrabbleTiles["L"] = { "value": 1, "original-distribution": 4, "number-remaining": 4, "image": "images/Scrabble_Tile_L.jpg" };
ScrabbleTiles["M"] = { "value": 3, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_M.jpg" };
ScrabbleTiles["N"] = { "value": 1, "original-distribution": 6, "number-remaining": 6, "image": "images/Scrabble_Tile_N.jpg" };
ScrabbleTiles["O"] = { "value": 1, "original-distribution": 8, "number-remaining": 8, "image": "images/Scrabble_Tile_O.jpg" };
ScrabbleTiles["P"] = { "value": 3, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_P.jpg" };
ScrabbleTiles["Q"] = { "value": 10, "original-distribution": 1, "number-remaining": 1, "image": "images/Scrabble_Tile_Q.jpg" };
ScrabbleTiles["R"] = { "value": 1, "original-distribution": 6, "number-remaining": 6, "image": "images/Scrabble_Tile_R.jpg" };
ScrabbleTiles["S"] = { "value": 1, "original-distribution": 4, "number-remaining": 4, "image": "images/Scrabble_Tile_S.jpg" };
ScrabbleTiles["T"] = { "value": 1, "original-distribution": 6, "number-remaining": 6, "image": "images/Scrabble_Tile_T.jpg" };
ScrabbleTiles["U"] = { "value": 1, "original-distribution": 4, "number-remaining": 4, "image": "images/Scrabble_Tile_U.jpg" };
ScrabbleTiles["V"] = { "value": 4, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_V.jpg" };
ScrabbleTiles["W"] = { "value": 4, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_W.jpg" };
ScrabbleTiles["X"] = { "value": 8, "original-distribution": 1, "number-remaining": 1, "image": "images/Scrabble_Tile_X.jpg" };
ScrabbleTiles["Y"] = { "value": 4, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_Y.jpg" };
ScrabbleTiles["Z"] = { "value": 10, "original-distribution": 1, "number-remaining": 1, "image": "images/Scrabble_Tile_Z.jpg" };
ScrabbleTiles["_"] = { "value": 0, "original-distribution": 2, "number-remaining": 2, "image": "images/Scrabble_Tile_Blank.jpg" };

/**************************************************************************
Global variables to keep track of stats
**************************************************************************/
var highscore = 0;
var original_remaining_tiles = 100;
var get_regex_string = "";
// The Object.keys() method returns an array of a given object's own enumerable property names
var random_letters = Object.keys(ScrabbleTiles);

/**************************************************************************
Main function to declare droppable and draggable
**************************************************************************/
$(function () {
    // When game is first loaded, generate the seven tiles on the tile rack
    generate_seven_tiles()

    // Any letter tiles should snap to the board, and if not, revert to the tile rack
    $(".letter_tiles").draggable({
        revert: "invalid",
        snap: ".droppable_tiles",
        snapMode: "inner",
        snapTolerance: 20
    });

    $(".droppable_tiles").droppable({
        // Accept tiles that do contain the class "innerletter" because it would break
        // a consecutive string
        accept: function(draggabletile, event, ui) { 
            // If it is an inner letter, cannot break consecutive word
            // Or if there is an existing tile on a board square
            if(draggabletile.hasClass("innerletter")||$(this).children().length == 1) { 
                return false;
            } else {
                return true;
            }
        },
        drop: function(event , ui) {
            drop_on_board.call(this, event, ui);
        }     
    });

    // The tile rack can also accept letter tiles as a possible drop location, otherwise revert
    $("#droppable_rack").droppable({
        accept: '.letter_tiles:not(.innerletter)',
        drop: function (event, ui) {
            drop_on_rack.call(this, event, ui);
        }
    });
});

/**************************************************************************
Start of Helper Functions
**************************************************************************/
function check_single_word(final_word) {
    // Regular expression to check whether the word is consecutive
    const pattern = /-{0,}([A-Z]{1,}|_{1,})-{1,}([A-Z]{1,}|_{1,})/;
    return pattern.test(final_word);
}

function calculate_points() {
    // Get the id of each letter and match it with the associative array
    var score = document.getElementById("currentScore");
    var points = 0;
    var count_double = 0;
    var get_letters = document.getElementsByClassName("droppable_tiles");
    for (var i = 0; i < get_letters.length; i++) {
        if (get_letters[i].childNodes.length != 0) {
            points += ScrabbleTiles[get_letters[i].childNodes[0].id]["value"];
            if (get_letters[i].classList.contains("double")) {
                count_double += 1;
            }
        }
    }
    if (count_double == 1) {
        score.innerHTML = points *= 2;
    } else if (count_double == 2) {
        score.innerHTML = points *= 4;
    } else {
        score.innerHTML = points;
    }
}

function generate_seven_tiles() {
    // Determines how many more tiles to append to rack, max is 7
    var numItems = $('#droppable_rack').children("img").length;
    for (var i = 0; i < 7 - numItems; i++) {
        // it would generate 5 tiles cuz there are two left, but since there 2 left in the bag, only generate 2
        if (original_remaining_tiles == 0) {
            break;
        }
        // This variable will generate a random index in the random_letters array
        // var random = Math.floor(Math.random() * random_letters.length);
        var random = 0;
        // Keept generating a random letter when number-remaining != 0
        do {
            random = Math.floor(Math.random() * random_letters.length);
        } while (original_remaining_tiles != 0 && ScrabbleTiles[random_letters[random]]["number-remaining"] == 0);

        // After generating a random letter, create a new jQuery div and append to rack
        var newDiv = jQuery('<img>', {
            id: random_letters[random],
            src: ScrabbleTiles[random_letters[random]]["image"],
            class: "letter_tiles ui-draggable"
        })
        $('#droppable_rack').append(newDiv.draggable({
            revert: "invalid",
            snap: ".droppable_tiles",
            snapMode: "inner",
            snapTolerance: 20
     
        }).css("position", "relative"))
        newDiv.position({
            at: "left"
        })
        // console.log("before:" + random_letters[random]);
        // console.log(ScrabbleTiles[random_letters[random]]["number-remaining"]);
        // After appending the letter, minus 1 from number-remaining
        ScrabbleTiles[random_letters[random]]["number-remaining"] -= 1;
        // console.log("after:" + random_letters[random]);
        // console.log(ScrabbleTiles[random_letters[random]]["number-remaining"]);
        
        // If subtracting by 1 does result in 0, remove from possible array
        if (ScrabbleTiles[random_letters[random]]["number-remaining"] == 0) {
            random_letters = random_letters.filter(function(value, index, arr){ 
                return value != random_letters[random];
                
            });
        }

        // Update remaining tile
        original_remaining_tiles -= 1
    }
    var remaining_tiles = document.getElementById("remainingTiles");
    remaining_tiles.innerHTML = "";
    remaining_tiles.innerHTML += original_remaining_tiles;
}

// Call next_word() when the Next Word button is clicked
function next_word() {
    // Remove all tiles on the board
    $('.droppable_tiles').children("img").remove();
    var word = document.getElementById("word");
    var numItems = $('#droppable_rack').children("img").length;

    word.innerHTML = "";

    if (numItems < 7 && original_remaining_tiles != 0) {
        generate_seven_tiles();
    }

    // Update high score by adding from current score
    var score = document.getElementById("currentScore");
    console.log(score.innerHTML.length);
    if (score.innerHTML.length == 0) {
        score = 0;
    } else {
        highscore += parseInt(score.innerHTML);
    }
    var high_score = document.getElementById("highestScore");
    high_score.innerHTML = highscore;
    score.innerHTML = "";
}

// Call restart_game() when the Start Over button is clicked
function restart_game() {
    original_remaining_tiles = 100;
    // Remove all tiles on the screen and regenerate seven tiles
    $('.droppable_tiles').children("img").remove();
    $('#droppable_rack').children("img").remove();
    // Restore ScrabbleTiles associative array
    random_letters = Object.keys(ScrabbleTiles);
    // console.log(ScrabbleTiles[random_letters["A"]]["number-remaining"]);
    for (var i = 0; i < random_letters.length; i++) {
        // console.log("befpre" + ScrabbleTiles[random_letters[i]]["number-remaining"]);
        ScrabbleTiles[random_letters[i]]["number-remaining"] = ScrabbleTiles[random_letters[i]]["original-distribution"];
        // console.log("after" + ScrabbleTiles[random_letters[i]]["number-remaining"]);
    }
    generate_seven_tiles();
    // Update scoreboards
    var word = document.getElementById("word");
    word.innerHTML = ""
    var high_score = document.getElementById("highestScore");
    high_score.innerHTML = ""
    var score = document.getElementById("currentScore");
    score.innerHTML = "";
    highscore = 0;
}

function drop_on_board(event, ui) {
    $(this).append(ui.draggable.css("position", "relative"))
    ui.draggable.position({
        of: $(this),
    })

    var draggableId = ui.draggable.attr("id");
    var div = document.getElementById("word");
    var check_final_word = "";
    div.innerHTML = "";

    // When a tile is dropped, assign that board square with its id
    $(this).attr("id", draggableId);

    // Go through each board square to display the current word 
    var get_letters = document.getElementsByClassName("droppable_tiles");
    for (var i = 0; i < get_letters.length; i++) {
        
        // If there is no child, mark its id as "-"
        if (get_letters[i].childNodes.length == 0) {
            get_letters[i].id = "-";
        }
        // Reset the board by removing "innerletter" id from another behavior
        if (get_letters[i].id != "-") {
            get_letters[i].childNodes[0].classList.remove("innerletter");
            div.innerHTML += get_letters[i].id;
        }
        // This variable keeps track of the word in current-time
        check_final_word += get_letters[i].id;

    }

    var result = check_single_word(check_final_word);

    // If the word is invalid, append that letter tile back to the rack
    if (result == true) {
        $("#droppable_rack").append(ui.draggable.css("position", "relative"))
        ui.draggable.position({
            at: "left",
        })
        // Update the game board ids
        div.innerHTML = "";
        check_final_word = "";
        for (var i = 0; i < get_letters.length; i++) {
            if (get_letters[i].childNodes.length == 0) {
                get_letters[i].id = "-";
            }
            if (get_letters[i].id != "-") {
                // get_letters[i].childNodes[0].classList.remove("innerletter");
                console.log("removed an inner letter")
                div.innerHTML += get_letters[i].id;
            }
            check_final_word += get_letters[i].id;
        }
    }

    let dummyString = check_final_word;
    dummyString = dummyString.replace(/-/g,'');
    var number_to_delete = dummyString.length - 2;
    var count = 0;
    var count_to_delete = 0;
    // Algorithm to assign an id of "innerletter" to letters besides the first and last letter
    for (var i = 0; i < get_letters.length; i++) {
        // Got the the board square with the first letter
        if (count > 0 && count_to_delete < number_to_delete) {
            // Adding an identifier so board won't accept movement with innerletters because
            // it will break a consecutive word
            get_letters[i].childNodes[0].classList.add("innerletter");
            count_to_delete += 1
        }
        if (get_letters[i].childNodes.length != 0) {
            count += 1;
        }
    }
    calculate_points();
}

function drop_on_rack(event, ui) {
    var check_final_word = "";
    $(this).append(ui.draggable.css({top:0,left:0}))
    ui.draggable.position({
        at: "left",
    })
    var div = document.getElementById("word");
    div.innerHTML = "";

    // Go through each board square to display the current word 
    var get_letters = document.getElementsByClassName("droppable_tiles");
    for (var i = 0; i < get_letters.length; i++) {
        if (get_letters[i].childNodes.length == 0) {
            get_letters[i].id = "-";
        }
        if (get_letters[i].id != "-") {
            get_letters[i].childNodes[0].classList.remove("innerletter");
            div.innerHTML += get_letters[i].id;
        }
        check_final_word += get_letters[i].id;
    }

    let dummyString = check_final_word;
    dummyString = dummyString.replace(/-/g,'');
    console.log(dummyString);
    var number_to_delete = dummyString.length - 2;
    var count = 0;
    var count_to_delete = 0;
    // Algorithm to assign an id of "innerletter" to letters besides the first and last letter
    for (var i = 0; i < get_letters.length; i++) {
        // Got the the board square with the first letter
        if (count > 0 && count_to_delete < number_to_delete) {
            // Adding an identifier so board won't accept movement with innerletters because
            // it will break a consecutive word
            get_letters[i].childNodes[0].classList.add("innerletter");
            count_to_delete += 1
        }
        if (get_letters[i].childNodes.length != 0) {
            count += 1;
        }
    }

    // If you moved a tile back to the rack and there is one letter left, remove its class
    // so it is able to be placed anywhere on the board again (because it may have been an inner 
    // letter)
    // let dummyString = check_final_word;
    // dummyString = dummyString.replace(/-/g,'');
    if(dummyString.length == 1){
        for (var i = 0; i < get_letters.length; i++) {
            if (get_letters[i].childNodes.length != 0) {
                get_letters[i].childNodes[0].classList.remove("innerletter");
            }
        }
    }
    calculate_points();
}

// https://www.w3schools.com/jquery/html_empty.asp
// Familiarized me with droppable and draggable functions 
// https://stackoverflow.com/questions/30372614/how-to-set-a-result-if-draggable-is-dropped-in-droppable-in-jquery
// Helped format snapping
// https://gabrieleromanato.name/jquery-snap-a-box-to-a-grid
// https://stackoverflow.com/questions/22094578/jquery-ui-draggable-snapping-into-a-container
// Helped me understand children
// https://stackoverflow.com/questions/7404544/jquery-count-number-of-divs-with-a-certain-class
// When the letter tiles couldn't visually be dragged
// https://stackoverflow.com/questions/33439010/jquery-draggable-stops-working-after-setting-divs-to-position-static
// Helped me handle reverting invalid tiles
// https://stackoverflow.com/questions/1444469/jquery-droppable-accept