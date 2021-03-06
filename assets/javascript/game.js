var states = ["select player", "select opponent", "fighting", "restart"];
var state = states[0];
var fighters = [];



function characterCreator(name, hp, atk_pts, counter){
    output = {};
    output.base_atk = atk_pts;
    output.name = name;
    output.id = name.split(" ")[0].toLowerCase();
    output.hp = hp;
    output.counter = counter;
    output.atk_pts = atk_pts;
    output.img = output.id + ".png"
    return output;
    }

// character stats courtesy of Andrew
var red = characterCreator("Red Knight", 200, 5, 40);
var orange = characterCreator("Orange Knight", 100, 20, 30);
//var green = characterCreator("Green Knight", 220, 5);
var blue = characterCreator("Blue Knight", 180, 12, 20);
var grey = characterCreator("Grey Knight", 170, 15, 10);

var char_array = [red, orange, blue, grey];

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
        cardDiv.addClass("user");

        //animate selected card to appropriate parent div
        moveAnimate(cardDiv, $("#player"))
        //set state to 'select opponent'
        state = states[1];  
    }
    
    else if(state == "select opponent"){

        //add appropriate classes to selected character, and move him to the arena
        cardDiv.addClass("enemy");
        // $("#opponent").append(cardDiv);
        moveAnimate(cardDiv, $("#opponent"))
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


function moveAnimate(element, target){

    //record starting position
    var oldOffset = element.offset();

    //append element to target div
    element.appendTo(target);

    //record final position
    var newOffset = element.offset();

    //create temporary clone of element to be animated
    var temp = element.clone().appendTo("body")
    
    //apply css magic and absurdly high z-index
    temp.css({
        'position': 'absolute',
        'left': oldOffset.left,
        'top': oldOffset.top,
        'z-index': 1000
    });

    //make div transparent until animation is over
    element.css("opacity", "0.0");

    var moveToArena = (target.attr("id") == "player" | target.attr("id") =="opponent")

    if(moveToArena){
        temp.animate({'top': newOffset.top, 'left': newOffset.left}, 'slow', function(){
        element.css("opacity", "1.0");
        temp.remove();   
        })
    }
    else{
        temp.animate({'top': newOffset.top, 'left': newOffset.left, 'opacity': 0.3}, 'slow', function(){
            element.css("opacity", "0.3");
            temp.remove();
        })
    }
}

function checkCondition(attacker, defender){// parameters are javascript objects

    if(defender.hp < 1){//if defender (opponent) is dead...
        
        //set approrpriate classes and move DOM to gravyard div
        var defender_dom = $("#" + defender.id);
        defender_dom.addClass("faded");
        moveAnimate(defender_dom, $("#graveyard"))
                
        //unfade cards in lobby
        $("#lobby").children().removeClass("faded");
        
        //modify globals
        state = states[1];
        fighters = fighters.slice(0, 1);
        
        //return string that will be passed to the combatLog() function
        return "won";
    }

    else if(attacker.hp < 1){//if attacker (player) is dead
        
        //set approrpriate classes and move DOM to gravyard div
        var player_dom = $("#" + attacker.id);
        player_dom.addClass("faded");

        moveAnimate(player_dom, $("#graveyard"))

        //modify globals
        state = states[3];

        //return string that will be passed to the combatLog() function

        return "lost";
    }

    //return string that will be passed to the combatLog() function
    return "none";
}

function combatLog(attacker, defender, result){
    var entry = $("<div class='entry'></div>")

    //if nobody was defeated
    if(result == "none"){
        entry.html("<p>You hit<b><span style='color: " + defender.id + ";'> " + defender.name + "</span></b> for<span class='log_dmg'> " + attacker.atk_pts + " </span>damage</p>" +
                    "<p><b><span style='color: " + defender.id + ";'> " + defender.name + "</span></b> hits you back for<span class='log_dmg'> " + defender.counter + " </span>damage</p>");
        
        $("#combatLog").prepend(entry);
    }

    //if the opponent was defeated...
    else if(result == "won"){
        entry.html("<p>You defeated<b><span style='color: " + defender.id + ";'> " + defender.name + "</span></b></p>" +
                    "<p>Choose your next opponent!</p>");
        entry.css("background-color", "green");

        $("#combatLog").prepend(entry);

        //check to see if there are any opponents left
        if($("#lobby").children().length == 0){
            var victory = $("<div class='entry'></div>")
            victory.html("<h1><b>Congratulations, you win!!!</b></h1>");
            victory.css("background-color", "green");
            victory.css("color", "gold");
            $("#combatLog").prepend(victory);
        }
    }

    //if you were defeated...
    else if(result == "lost"){
        entry.html("<p>You have been defeated by <b><span style='color: " + defender.id + ";'> " + defender.name + "</span></b></p>" +
                    "<p>Reset the game and try again!");
        entry.addClass("log_dead");
        $("#combatLog").prepend(entry);
    }
}


function updateCardStats(attacker, defender){// parameters are javascript objects

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
    
};

function fight(attacker, defender){// this is the attack button, parameters are DOM objects

    //assure state is set to "fighting"
    if(state != states[2]){return};

    player = attacker.data();
    opponent = defender.data();

    opponent.hp -= player.atk_pts;
    player.hp -= opponent.counter;
    

    updateCardStats(player, opponent);

    var outcome = checkCondition(player, opponent);

    combatLog(player, opponent, outcome);

    player.atk_pts += player.base_atk;
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