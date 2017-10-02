var states = ["select player", "select opponent", "fighting"];
var state = states[0];
var picked = [];


function characterCreator(name, hp, atk_pts){
    output = {};
    output.base_atk = atk_pts;
    output.name = name;
    output.id = name.split(" ")[0].toLowerCase();
    output.hp = hp;
    output.atk_pts = atk_pts;
    output.img = output.id + ".png"
    return output;
    }

var red = characterCreator("Red Knight", 150, 40);
var orange = characterCreator("Orange Knight", 10, 2);
var green = characterCreator("Green Knight", 500, 3);
var blue = characterCreator("Blue Knight", 200, 50);
var grey = characterCreator("Grey Knight", 100, 40);

var char_array = [red, orange, green, blue, grey];

function fillLobby(chars){
    var img_path = "assets/images/"
    for(i = 0; i < chars.length; i ++){

        //create div
        chrDiv = $("<div class='card' id=" + chars[i].id + "></div>");

        //fill innerHTML of div (there has got to be a better way to do this)
        chrDiv.html("<p>" + chars[i].name + "</p>" +
                    "<img src='" + img_path + chars[i].img +"'/>" + "<br>" +
                    "<div class='cardstat'>HP: " + chars[i].hp + "</div>" +
                    "<div class='cardstat'>ATK: " + chars[i].base_atk + "</div>")

        //append chrDiv to lobby           
        $("#lobby").append(chrDiv);

    }
}

function select(card){
    var id = "#" + card;
    var cardDiv = $("#" + card);
    if(picked.includes(id)){return};

    picked.push(id);
    
    if(state == "select player"){

        //add user class to selected character and move him to the arena
        cardDiv.addClass("user picked hide_ovf");
        $("#player").append($('.user'));

        //set state to 'select opponent'
        state = states[1];  
    }
    
    else if(state == "select opponent"){

        //add opponent class to selected character, and move him to the arena
        cardDiv.addClass("enemy picked hide_ovf");
        $("#opponent").append(cardDiv);

        //fade out remaining characters
        $("#lobby").children().addClass("faded");

        //place 'vs' image on the scree between the two fighters
        $("#vs img").attr("src", "assets/images/vs.png");
        $("#atk_btn").removeClass("faded");




        //set state to 'fighting'
        state = states[2];
        }
    else{return};
};



function updateStats(attacker, defender){
    //update the scoreboard after each press of the attack button
    //don't show attack power
}

function fight(attacker, defender){// this is the attack button
    defender.hp -= attacker.atk_pts;
    attack.hp -= defender.base_atk;
    attacker.atk_pts += attacker.base_atk

    if(defender.hp < 1){
        var id = "#" + defender.name;
        $(id).html("");
        fightInProgress = false
    }
    //display hp and atk pts for atker and dfnder 
    //HEALTH BAR
}

$(document).ready(function(){
    fillLobby(char_array);

    $(".card").on("click", function(ev) {
        var char = event.currentTarget.id;
        select(char)
    });

});