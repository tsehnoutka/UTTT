//  adapted from:
// https://embed.plnkr.co/plunk/NAOYuT

//  // TODO:
//  add AI so you can play by yourself
//  make the moves x's ond o's instead of blocks
//  Undo function ?
//  Why does winning message box pop up then the screen gets colored in? -
//       Cause it is an even driven program,  the screen doesn't get updated
//       until the end of the function
//  Make network game so two cam play over network
//  use XOR to determine whose turn it is instead of Click Count

var playerScore = new Array();  //  player, game, array of squares
for (p = 0; p < 2; p++) {
    playerScore[p] = new Array();
    for (g = 0; g < 10; g++)
        playerScore[p][g] = new Array();
}
var catsGame=new Array();
var currentGameNumber = -1;
var gameNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var gameLocation = [1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3];
var player = 0;  // 0 for player 1, 1 for pkayer 2
var clickCount = 0;
var  boxesTaken=0;
const OuterGame = 9;
var Won = false;


function clicked(strId) {  //  get game ( remove first two charageters)
    var game = strId.substring(0, 1) - 1; //get the inner game #  ( arrays starts at 0)
    var strBox = strId.slice(2);
    var box = parseFloat(strBox); //  remove the period
//
console.log("clicked(\""+strId+"\");")
    if (boxesTaken > 81) {
        if (!Won)
            alert("CATS game Please start another game");
        else
            alert("Please start another game");
        return;
    }
    if (currentGameNumber != -1 && game != currentGameNumber) {
        alert("Please make your selection in the correct sub-game");
        return;
    }

    //  get player
    if (clickCount % 2 == 0)
        player = 0;  //player 1
    else
        player = 1; // player 2

    //console.log("BEGINNING - Player: " + player + " id: " + strId + " game: " + game + " box: " + box + " currentGameNumber: " + currentGameNumber);

    if (playerScore[0][game].indexOf(box) >= 0 || playerScore[1][game].indexOf(box) >= 0 )
      return;

             //  the square is open
        var color = (player == 0) ? "red" : "green";
        var availableColor = (player == 0) ? "lightgreen" : "lightpink";
        document.getElementById(strId).style.backgroundColor = color;  // paint it red for player one
        playerScore[player][game].push(box); //  put this square's id in the array
        clickCount++;  // increment clickcount
        boxesTaken++;

        subGameWinner = checkWinnerPlayer(playerScore[player][game]);
        if (subGameWinner) {  //  set that whole section to the color of the current player
            playerScore[player][OuterGame].push(gameLocation[game]);
            for (x = 1; x <= 3; x++)
                for (y = 1; y <= 3; y++) {
                  boxTemp = game + 1 + "." + x + "." + y;
                  if ((document.getElementById(boxTemp).style.backgroundColor != "green") &&
                      (document.getElementById(boxTemp).style.backgroundColor != "red" ) ) {
                        //console.log("***********************************")
                       boxesTaken++;
                     }
                  document.getElementById(boxTemp).style.backgroundColor = color;
                }
            if (checkWinnerPlayer(playerScore[player][OuterGame])) {
                alert(color + ' wins click play again');
                boxesTaken = 82;
                Won = true;
            }
        }
        // if the box clicked in the inner game is in the outter game,  the next player can move anywhere

        //  Need to check if the  box is inthe cats array
        if (playerScore[0][OuterGame].indexOf(box) >= 0 || playerScore[1][OuterGame].indexOf(box) >= 0  || catsGame.indexOf(box) >= 0)
            currentGameNumber = -1;
        else
            currentGameNumber = gameLocation.indexOf(box);


    color = (player != 0) ? "red" : "green";
    document.getElementById("turnbox").style.backgroundColor = color;
  //  console.log("END - Player: " + player + " id: " + strId + " game: " + game + " box: " + box + " currentGameNumber: " + currentGameNumber);

    if (!Won) {
      if (!subGameWinner){
      var p1g = playerScore[0][game].length;
      var p2g = playerScore[1][game].length;
      if(p1g +p2g ==9){
        catsGame.push(gameLocation[game]);
        }
      }
        //  clear available moves
        for (g = 1; g <= 9; g++)  // game
            for (x = 1; x <= 3; x++)
                for (y = 1; y <= 3; y++) {
                    myIndex = g + "." + x + "." + y;
                  //  console.log(myIndex + " : " + document.getElementById(myIndex).style.backgroundColor);
                    if ((document.getElementById(myIndex).style.backgroundColor == "lightgreen") ||
                        (document.getElementById(myIndex).style.backgroundColor == "lightpink"))
                        document.getElementById(myIndex).style.backgroundColor = ""
                }

        //  show available moves
        if (currentGameNumber == -1) {  //  if the next move is in an inner game that is already full, the player van move anywhere
            //console.log("current game number = -1");
            for (g = 1; g <= 9; g++)  // game
                for (x = 1; x <= 3; x++)
                    for (y = 1; y <= 3; y++) {
                        myIndex = g + "." + x + "." + y;
                        //console.log(myIndex + " background color : " + document.getElementById(myIndex).style.backgroundColor);
                        if (document.getElementById(myIndex).style.backgroundColor == "")
                            document.getElementById(myIndex).style.backgroundColor = availableColor;
                        //document.getElementById(myIndex).style.backgroundColor = "lightgray" ;
                    }
        }
        else {  //  just highlight the inner game there the playerc can move
            for (x = 1; x <= 3; x++)
                for (y = 1; y <= 3; y++) {
                    myIndex = currentGameNumber + 1 + "." + x + "." + y;
                    if (document.getElementById(myIndex).style.backgroundColor == "")
                        document.getElementById(myIndex).style.backgroundColor = availableColor;
                }
        }
    } //  end if NOT Won
    //console.log("Click Count - " +clickCount);
}

function Reset() {
    location.reload();
}

function Undo() {
    //  remove th players move and make that square white again
    //  remove the shading and put it back to where it was
    //  change the color of the "turn" indicator
    clickCount--;  //  remove one from teh Clickcount

}

function checkWinnerPlayer(currentGame) {
    var playerrows = [];
    var playercols = [];

    for (i = 0; i < currentGame.length; i++) {
        var rowsColumns = [];
        rowsColumns = currentGame[i].toString().split('.');
        playerrows.push(parseInt(rowsColumns[0]));
        playercols.push(parseInt(rowsColumns[1]));
    }

    var playerWinner = checkForRowColumn(playerrows);
    if (!playerWinner)
        playerWinner = checkForRowColumn(playercols);
    if (!playerWinner)
        playerWinner = checkForDiagonal(currentGame);

    if (playerWinner) {
        return true;
    }
    return false;
}

function checkForRowColumn(array) {
    if (array.length > 2) {
        var one = 0;
        var two = 0;
        var three = 0;
        for (i = 0; i < array.length; i++) {
            if (array[i] == 1)
                one++;
            if (array[i] == 2)
                two++;
            if (array[i] == 3)
                three++;
        }
        if (one == 3 || two == 3 || three == 3)
            return true;
    }
    return false;
}

function checkForDiagonal(playerScoreD) {
    if (playerScoreD.length > 2) {
        if (playerScoreD.indexOf(1.1) > -1 && playerScoreD.indexOf(2.2) > -1 && playerScoreD.indexOf(3.3) > -1)
            return true;
        if (playerScoreD.indexOf(1.3) > -1 && playerScoreD.indexOf(2.2) > -1 && playerScoreD.indexOf(3.1) > -1)
            return true;""
    }
    return false;
}

function pageLoad(){
//  var test = require('./test.js')
  //rowWin();
  catsGameTest();
  //colWin()
  //diagWin();
}
function diagWin() {
clicked("1.1.1");
clicked("1.2.1");
clicked("4.1.1");
clicked("1.2.3");
clicked("6.1.1");
clicked("1.2.2");
clicked("5.3.1");
clicked("7.2.1");
clicked("4.2.2");
clicked("5.2.2");
clicked("5.1.1");
clicked("4.1.2");
clicked("2.2.2");
clicked("5.1.2");
clicked("2.3.2");
clicked("8.3.1");
clicked("7.2.2");
clicked("5.3.2");
clicked("8.3.3");
clicked("9.1.3");
clicked("3.3.3");
clicked("9.3.1");
clicked("7.3.3");
clicked("9.2.2");
}
function colWin(){
  clicked("1.1.1");
  clicked("1.2.2");
  clicked("5.1.1");
  clicked("1.2.1");
  clicked("4.1.1");
  clicked("1.2.3");
  clicked("6.2.1");
  clicked("4.1.3");
  clicked("3.2.1");
  clicked("4.3.1");
  clicked("7.2.1");
  clicked("4.2.2");
  clicked("5.3.1");
  clicked("7.1.1");
  clicked("2.3.1");
  clicked("7.3.3");
  clicked("9.3.1");
  clicked("7.2.2");
}
function catsGameTest(){

  clicked("1.1.1");
  clicked("1.2.2");
  clicked("5.2.1");
  clicked("4.2.3");
  clicked("6.3.1");
  clicked("7.3.2");
  clicked("8.3.3");
  clicked("9.1.3");
  clicked("3.1.2");
  clicked("2.1.1");
  clicked("1.3.3");
  clicked("9.2.1");
  clicked("4.2.2");
  clicked("5.2.2");
  clicked("5.3.2");
  clicked("8.2.2");
  clicked("5.1.2");
  clicked("2.3.2");
  clicked("8.1.1");
  clicked("1.3.1");
  clicked("7.3.1");
  clicked("7.2.1");
  clicked("4.1.3");
  clicked("3.2.1");
  clicked("4.3.3");
  clicked("9.3.2");
  clicked("8.3.2");
  clicked("8.3.1");
  clicked("7.3.3");
  clicked("9.2.3");
  clicked("6.2.3");
  clicked("6.2.2");
  clicked("5.2.3");
  clicked("6.3.2");
  clicked("8.1.2");
  clicked("2.2.3");
  clicked("6.1.1");
  clicked("1.2.1");
  clicked("4.2.1");
  clicked("8.2.1");
  clicked("4.3.1");
  clicked("7.1.1");
  clicked("1.1.2");
  clicked("2.2.2");
  clicked("5.3.1");
  clicked("7.2.2");
  clicked("5.1.3");
  clicked("3.3.1");
  clicked("8.1.3");
  clicked("3.3.2");
  clicked("3.3.3");
  clicked("9.2.2");
  clicked("4.1.2");
  clicked("2.3.1");
  clicked("4.1.1");
  clicked("1.1.3");
  clicked("3.1.1");
  clicked("1.2.3");
  clicked("6.1.2");
  clicked("2.3.3");
  clicked("9.3.1");
  clicked("9.1.1");
  clicked("3.2.2");
  clicked("9.3.3");
  clicked("2.2.1");
  clicked("2.1.2");
  clicked("2.1.3");
}
function rowWin(){
  clicked("1.1.1");
  clicked("1.2.2");
  clicked("5.1.1");
  clicked("1.2.1");
  clicked("4.1.1");
  clicked("1.2.3");
  clicked("6.1.2");
  clicked("2.3.1");
  clicked("7.1.2");
  clicked("2.2.2");
  clicked("5.1.2");
  clicked("2.1.3");
  clicked("3.2.3");
  clicked("6.3.2");
  clicked("8.1.3");
  clicked("3.1.2");
  clicked("7.1.3");
  clicked("3.2.2");
  clicked("5.1.3");
  clicked("3.3.2");
}
