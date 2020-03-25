//  adapted from:
// https://embed.plnkr.co/plunk/NAOYuT

/*  board Layout:  < game >< Y >< X >
1.1.1 | 1.1.2 | 1.1.3   ||   2.1.1 | 2.1.2 | 1.2.3   ||   3.1.1 | 3.1.2 | 3.1.3
-----------------------------------------------------------------------
1.2.1 | 1.2.2 | 1.2.3   ||   2.2.1 | 2.2.2 | 2.2.3   ||   3.2.1 | 3.2.2 | 3.2.3
-----------------------------------------------------------------------
1.3.1 | 1.3.2 | 1.3.3   ||   2.3.1 | 2.3.2 | 2.3.3   ||   3.3.1 | 3.3.2 | 3.3.3

================================================================================

4.1.1 | 4.1.2 | 4.1.3   ||   5.1.1 | 5.1.2 | 5.2.3   ||   6.1.1 | 6.1.2 | 6.1.3
-----------------------------------------------------------------------
4.2.1 | 4.2.2 | 4.2.3   ||   5.2.1 | 5.2.2 | 5.2.3   ||   6.2.1 | 6.2.2 | 6.2.3
-----------------------------------------------------------------------
4.3.1 | 4.3.2 | 4.3.3   ||   5.3.1 | 5.3.2 | 5.3.3   ||   6.3.1 | 6.3.2 | 6.3.3

================================================================================

7.1.1 | 7.1.2 | 7.1.3   ||   8.1.1 | 8.1.2 | 8.2.3   ||   9.1.1 | 9.1.2 | 9.1.3
-----------------------------------------------------------------------
7.2.1 | 7.2.2 | 7.2.3   ||   8.2.1 | 8.2.2 | 8.2.3   ||   9.2.1 | 9.2.2 | 9.2.3
-----------------------------------------------------------------------
7.3.1 | 7.3.2 | 7.3.3   ||   8.3.1 | 8.3.2 | 8.3.3   ||   9.3.1 | 9.3.2 | 9.3.3

*/

//  // TODO:
//  add AI so you can play by yourself
//  make the moves x's and o's instead of blocks
//  Make network game so two cam play over network
//  get test cases in a different file

//  Why does winning message box pop up then the screen gets colored in?
//  change Alerts to Modals
//        https://www.w3schools.com/howto/howto_css_modals.asp
//        https://embed.plnkr.co/plunk/RHIPp8

var playerScore = new Array();  //  player, game, array of squares
for (p = 0; p < 2; p++) {
    playerScore[p] = new Array();
    for (g = 0; g < 10; g++)
        playerScore[p][g] = new Array();
}
var catsGame = new Array();
var currentGameNumber = -1;
var gameLocation = [1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3];
var player = 0;  // 0 for player 1, 1 for pkayer 2
const PLAYER1=0;
const PLAYER2=1;
var boxesTaken = 0;
const OUTERGAME = 9;
var won = false;
var previousIDs = new Array();


function clicked(strId) {  //  get game ( remove first two charageters)
    var game = strId.substring(0, 1) - 1; //get the inner game #  ( arrays starts at 0)
    var strBox = strId.slice(2);
    var box = parseFloat(strBox); //  remove the period

    //console.log("clicked(\"" + strId + "\");" Current game # : "  + currentGameNumber");
    if (boxesTaken > 79) {  // game over
        if (!won)
            PopUpMessage("CATS game \n\nPlease start another game");
        else
            PopUpMessage("Please start another game");
        return;
    }
    //  user didin't click in available subgame
    if (currentGameNumber != -1 && game != currentGameNumber) {
        PopUpMessage("Please make your selection in the correct sub-game");
        return;
    }

      //  if you are not clicking in an open square. exit function
    if (playerScore[PLAYER1][game].indexOf(box) >= 0 || playerScore[PLAYER2][game].indexOf(box) >= 0)
        return;

    //  the square is open
    var color = (player == PLAYER1) ? "red" : "green";
    var availableColor = (player == PLAYER1) ? "lightgreen" : "lightpink";
    document.getElementById(strId).style.backgroundColor = color;  // paint it red for player one
    playerScore[player][game].push(box); //  put this square's id in the array

    boxesTaken++;

    subGameWinner = checkWinnerPlayer(playerScore[player][game]);
    if (subGameWinner) {  //  set that whole section to the color of the current player
        playerScore[player][OUTERGAME].push(gameLocation[game]);
        for (x = 1; x <= 3; x++)
            for (y = 1; y <= 3; y++) {
                boxTemp = game + 1 + "." + x + "." + y;
                if ((document.getElementById(boxTemp).style.backgroundColor != "green") &&
                    (document.getElementById(boxTemp).style.backgroundColor != "red")) {
                    boxesTaken++;
                }
                document.getElementById(boxTemp).style.backgroundColor = color;
            }
        if (checkWinnerPlayer(playerScore[player][OUTERGAME])) {
            PopUpMessage(color + ' wins click play again');
            boxesTaken = 82;
            won = true;
        } //  if outer game won
    }  //  if sub-winner
    // if the box clicked in the inner game is in the outter game,  the next player can move anywhere
    if (playerScore[PLAYER1][OUTERGAME].indexOf(box) >= 0 || playerScore[PLAYER2][OUTERGAME].indexOf(box) >= 0 || catsGame.indexOf(box) >= 0)
        currentGameNumber = -1;
    else
        currentGameNumber = gameLocation.indexOf(box);

    //  set next turn color
    color = (player != PLAYER1) ? "red" : "green";
    document.getElementById("turnbox").style.backgroundColor = color;

    if (!won) {
        if (!subGameWinner) {
            var p1g = playerScore[0][game].length;
            var p2g = playerScore[1][game].length;
            if (p1g + p2g == 9) {
                catsGame.push(gameLocation[game]);
            }
        }  //  end if not sub game winner
        //  clear available moves
        for (g = 1; g <= 9; g++)  // game
            for (x = 1; x <= 3; x++)
                for (y = 1; y <= 3; y++) {
                    myIndex = g + "." + x + "." + y;
                    //  console.log(myIndex + " : " + document.getElementById(myIndex).style.backgroundColor);
                    if ((document.getElementById(myIndex).style.backgroundColor == "lightgreen") ||
                        (document.getElementById(myIndex).style.backgroundColor == "lightpink"))
                        document.getElementById(myIndex).style.backgroundColor = ""
                }  //  end for y

        //  show available moves
        //  if the next move is in an inner game that is already full, the player van move anywhere
        if (currentGameNumber == -1) {
            for (g = 1; g <= 9; g++)  // game
                for (x = 1; x <= 3; x++)
                    for (y = 1; y <= 3; y++) {
                        myIndex = g + "." + x + "." + y;
                        if (document.getElementById(myIndex).style.backgroundColor == "")
                            document.getElementById(myIndex).style.backgroundColor = availableColor;
                    }  //  end for y
        }
        else {  //  just highlight the inner game there the playerc can move
            for (x = 1; x <= 3; x++)
                for (y = 1; y <= 3; y++) {
                    myIndex = currentGameNumber + 1 + "." + x + "." + y;
                    if (document.getElementById(myIndex).style.backgroundColor == "")
                        document.getElementById(myIndex).style.backgroundColor = availableColor;
                }
        }  //  end else
    } //  end if NOT won
    player=(player ^ PLAYER1)?PLAYER1:PLAYER2;  //  change player
    previousIDs.push(strId);
    document.getElementById('Undo').disabled=false;
}  //  end clicked function

function Reset() {
    location.reload();
}

function Undo() {
      var previousID = previousIDs.pop();
      console.log("previous ID = " + previousID);
      var previousGame = previousID.substring(0, 1) - 1;
      console.log("previous Game = " + previousGame);
      var strP_Box = previousID.slice(2);
      var previousBox = parseFloat(strP_Box);

      //console.log("current game = " + currentGameNumber);
      //console.log("current player = " + player);
      //restore the current sub game
      //  I think i can make this a function passing the game number
      for (x = 1; x <= 3; x++)
          for (y = 1; y <= 3; y++) {
              myIndex = currentGameNumber+1 + "." + x + "." + y;
              if ((document.getElementById(myIndex).style.backgroundColor == "lightgreen") ||
                  (document.getElementById(myIndex).style.backgroundColor == "lightpink"))
                  document.getElementById(myIndex).style.backgroundColor = ""
          }  //  end for y

     document.getElementById(previousID).style.backgroundColor = "";

      // remove last move
      var lastshade = (player != PLAYER1) ? "lightpink" : "lightgreen";
      player=(player ^ PLAYER1)?PLAYER1:PLAYER2;
      var lastcolor = (player == PLAYER1) ? "red" : "green";
      for (x = 1; x <= 3; x++)
          for (y = 1; y <= 3; y++) {
              myIndex = previousGame+1 + "." + x + "." + y;
              if(document.getElementById(myIndex).style.backgroundColor == "")
                  document.getElementById(myIndex).style.backgroundColor = lastshade;
          }  //  end for y
      document.getElementById("turnbox").style.backgroundColor = lastcolor;
      boxesTaken--;
      currentGameNumber=previousGame;
      playerScore[player][previousGame].indexOf(previousBox);
      playerScore[player][previousGame].splice(playerScore[player][previousGame].indexOf(previousBox), 1);
      document.getElementById('Undo').disabled=true;
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
            return true; ""
    }
    return false;
}

// got the modal code form:
//  https://www.w3schools.com/howto/howto_css_modals.asp
function PopUpMessage(message){
  var modal = document.getElementById("myModal");
  var modalContent = document.getElementById("mc");
  modalContent.innerHTML= "<br><span id=\"spanID\" class=\"close\" onclick=\"spanClicked()\">x</span><br><br><p>" +message+"</p><br>";
  //modalContent.textContent= ???;
  modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
function spanClicked() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function windowClicked(event) {
  var modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function pageLoad() {
    //  var test = require('./test.js')
    //rowWin();   //  green wins across the top
    //catsGameTest();  //LIS
    //colWin()   //  green wins first column
    //diagWin();   //  green wins top left ot bottom right
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
function colWin() {
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
function catsGameTest() {
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
    clicked("4.3.2");
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
function rowWin() {
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
