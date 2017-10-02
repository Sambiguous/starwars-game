var states = ["select player", "select opponent", "fighting"];
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



function updateStats(attacker, defender){
    var player = $("#" + attacker.id)
    var opponent = $("#" + defender.id)

    $("#" + attacker.id + " .hp").html("HP: " + player.data("hp"));
    $("#" + attacker.id + " .atk").html("ATK: " + player.data("atk_pts"));

    $("#" + defender.id + " .hp").html("HP: " + opponent.data("hp"));
    $("#" + defender.id + " .atk").html("ATK: " + opponent.data("atk_pts"));

}

function fight(attacker, defender){// this is the attack button
    player = attacker.data();
    opponent = defender.data();

    opponent.hp -= player.atk_pts;
    player.hp -= opponent.base_atk;
    player.atk_pts += player.base_atk;

    updateStats(player, opponent)

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

    $("#atk_btn").on("click", function() {
        var player = $("#" + fighters[0]);
        var opponent = $("#" + fighters[1]);
        fight(player, opponent);
    })

});