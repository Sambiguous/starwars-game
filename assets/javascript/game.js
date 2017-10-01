var states = ["select attacker", "select defender", "fighting"];
var state = states[0];


function characterCreator(name, hp, atk_pts){
    output = {};
    output.base_atk = atk_pts;
    output.name = name;
    output.id = name.split(" ")[0];
    output.hp = hp;
    output.atk_pts = atk_pts;
    output.img = output.id + ".jpg"
    return output;
    }

var luke = characterCreator("Luke Skywalker", 150, 40);
var boba = characterCreator("Boba Fett", 10, 2);
var jaba = characterCreator("Jabba the Hutt", 500, 3);
var vader = characterCreator("Darth Vader", 200, 50);
var han = characterCreator("Han Solo", 100, 40);

var char_array = [luke, boba, jaba, vader, han]

function fillLobby(chars){
    var img_path = "assets/images/"
    for(i = 0; i < chars.length; i ++){

        //create div
        chrDiv = $("<div class='card' id=" + chars[i].id + "></div>");

        //fill innerHTML of div (there has got to be a better way to do this)
        chrDiv.html("<h3>" + chars[i].name + "</h3>" +
                    "<img src='" + img_path + chars[i].img +"'/>" + "<br>" +
                    "<div class='left'> HP: " + chars[i].hp + "</div>" +
                    "<div class='right'>ATK: " + chars[i].base_atk + " </div>")

        //append chrDiv to lobby           
        $("#lobby").append(chrDiv);

    }
}

function select(card){
    var cardDiv = $("#" + card);
    if(state == "select attacker"){
        cardDiv.addClass("player");
        $("#attacker").append(cardDiv);
        state = states[1];  
    }
    else if(state == "select defender"){
        cardDiv.addClass("defender");
        $("#defender").append(cardDiv);
        state = states[2];
    }
}


function selectAttacker(character){
    if(fightInProgress){return};
    //set class attacker
    //move to arena
    //populate stats
    //stuff happens
}

function selectDefender(character){
    if(fightInProgress){return};
    //set class defender
    //move to arena
        //delete from current div
        //append to arena
    //populate stats
    //stuff happens
    fightInProgress = true;
}

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