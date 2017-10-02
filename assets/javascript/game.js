var states = ["select player", "select opponent", "fighting", "restart"];
var state = states[0];
var fighters = [];



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

var red = characterCreator("Red Knight", 100, 10);
var orange = characterCreator("Orange Knight", 100, 10);
var green = characterCreator("Green Knight", 100, 10);
var blue = characterCreator("Blue Knight", 100, 10);
var grey = characterCreator("Grey Knight", 100, 10);

var char_array = [red, orange, green, blue, grey];

function fillLobby(chars){
    var img_path = "assets/images/"
    for(i = 0; i < chars.length; i ++){

        //create div
        chrDiv = $("<div class='card' id=" + chars[i].id + "></div>");

        //set data variable of div equal to appropriate character object
        chrDiv.data(chars[i])

        //fill innerHTML of div (there has got to be a better way to do this)
        chrDiv.html("<p>" + chars[i].name + "</p>" +
                    "<img src='" + img_path + chars[i].img +"'/>" + "<br>" +
                    "<div class='cardstat hp'>HP: " + chars[i].hp + "</div>" +
                    "<div class='cardstat atk'>ATK: " + chars[i].base_atk + "</div>")


        //append chrDiv to lobby           
        $("#lobby").append(chrDiv);

    }
}

function select(card){
    //grab DOM element based on the card parameter, which coresponds to a specific id
    var cardDiv = $("#" + card);

    //make sure element has not been selected yet
    if(fighters.includes(card)){return}

    //log name of selected character to the 'fighters' array
    fighters.push(cardDiv.data("id"))

    
    if(state == "select player"){

        //add appropriate classes to selected character and move him to the arena
        cardDiv.addClass("user picked hide_ovf");
        $("#player").append($('.user'));

        //set state to 'select opponent'
        state = states[1];  
    }
    
    else if(state == "select opponent"){

        //add appropriate classes to selected character, and move him to the arena
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

function checkCondition(attacker, defender){// parameters are javascript objects

    if(attacker.hp < 1){//if attacker (player) is dead
        
        //set approrpriate classes and move DOM to gravyard div
        var player_dom = $("#" + attacker.id);
        player_dom.addClass("faded");
        player_dom.removeClass("picked");
        $("#graveyard").append(player_dom);

        //modify globals
        state = states[3];
    }
    else if(defender.hp < 1){//if defender (opponent) is dead...

        //set approrpriate classes and move DOM to gravyard div
        var defender_dom = $("#" + defender.id);
        defender_dom.addClass("faded");
        defender_dom.removeClass("picked");
        $("#graveyard").append(defender_dom);

        //unfade cards in lobby
        $("#lobby").children().removeClass("faded");

        //modify globals
        state = states[1];
        fighters = fighters.slice(0, 1);
        console.log(fighters);
    }
}

function combatLog(attacker, defender){
    var entry = $("<div class='entry'></div>")
    entry.html("<p>You hit<span style='color: " + defender.id + ";'> " + defender.name + "</span> for<span class='log_dmg'> " + attacker.atk_pts + " </span>damage</p>" +
                "<p><span style='color: " + defender.id + ";'> " + defender.name + "</span> hits you back for<span class='log_dmg'> " + defender.base_atk + " </span>damage</p>");
    $("#combatLog").prepend(entry);
}


function updateStats(attacker, defender){// parameters are javascript objects

    //update player stats
    if(attacker.hp > 0){
        $("#" + attacker.id + " .hp").html("HP: " + attacker.hp);
    }
    else{
        $("#" + attacker.id + " .hp").html("HP: 0");
        
    }
    $("#" + attacker.id + " .atk").html("ATK: " + attacker.atk_pts);

    //update opponent stats
    if(defender.hp > 0){
        $("#" + defender.id + " .hp").html("HP: " + defender.hp);
    }
    else{
        $("#" + defender.id + " .hp").html("HP: 0");
    }
    $("#" + defender.id + " .atk").html("ATK: " + defender.atk_pts);
    combatLog(attacker, defender);
};

function fight(attacker, defender){// this is the attack button, parameters are DOM objects

    if(state != states[2]){return};

    player = attacker.data();
    opponent = defender.data();

    opponent.hp -= player.atk_pts;
    player.hp -= opponent.base_atk;
    player.atk_pts += player.base_atk;

    updateStats(player, opponent);

    checkCondition(player, opponent);

    //display hp and atk pts for atker and dfnder 
    //HEALTH BAR
}

$(document).ready(function(){
    fillLobby(char_array);

    $(".card").on("click", function(ev) {
        var char = event.currentTarget.id;
        select(char)
    });

    $("#atk_btn").on("click", function() {
        var player = $("#" + fighters[0]);
        var opponent = $("#" + fighters[1]);
        fight(player, opponent);
    })

});