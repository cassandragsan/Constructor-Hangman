//require modules
var inquirer = require('inquirer');
var isLetter = require('is-letter');

//pull in exported modules from other js files
var Word = require('./word.js');
var Game = require('./game.js');

var hangManScreen = Game.newWord.hangman;

//require('events').EventEmitter.prototype._maxListeners = 100;
require('events').prototype._maxListeners = 100;

var hangman = {
  wordBank: Game.newWord.wordList,
  guessesRemaining: 10,
    //Array to hold letters guessed by the player
    guessedLetters: [],
	display: 0,
	currentWord: null,

  //Are you ready to start the game prompt
  startGame: function() {
    var that = this;
  
  	if(this.guessedLetters.length > 0){
      this.guessedLetters = [];
    }

    var getdown = "GET DOWN :-)";

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "You ready to get down with the " + getdown + "?"
    }]).then(function(answer) {
      if(answer.play){
        that.newGame();
      } else{
        console.log("OK. We can play another time.");
      }
    })},

  //Start a new game
    newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Alright! Let's get to it!");

 //Random number
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLetters();

 //Displays word to guess as blanks.
      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } else{
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
  resetGuessesRemaining: function() {
    this.guessesRemaining = 10;
  },
  keepPromptingUser : function(){
    var that = this;
    //asks player for a letter
    inquirer.prompt([{
      name: "LetterChosen",
      type: "input",
      message: "Please choose a letter:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      //toUpperCase because words in word bank are all caps
      var letterReturned = (ltr.LetterChosen).toUpperCase();
      //adds to the guessedLetters array if it isn't already there
      var guessedAlready = false;
        for(var i = 0; i<that.guessedLetters.length; i++){
          if(letterReturned === that.guessedLetters[i]){
            guessedAlready = true;
          }
        }
        //if the letter wasn't guessed already run through entire function, else reprompt user
        if(guessedAlready === false){
          that.guessedLetters.push(letterReturned);

          var found = that.currentWord.checkIfLetterFound(letterReturned);
          //if none were found tell user they were wrong
          if(found === 0){
            console.log('Sorry. That is the wrong guess!');
            that.guessesRemaining--;
            that.display++;
            console.log('No. of Guesses remaining: ' + that.guessesRemaining);
            console.log(hangManScreen[(that.display)-1]);

            console.log('\n*******************');
            console.log(that.currentWord.wordRender());
            console.log('\n*******************');

            console.log("Letters guessed: " + that.guessedLetters);
          } else{
            console.log('YAY! You guessed correctly!');
              //checks to see if user won
              if(that.currentWord.didWeFindTheWord() === true){
                console.log(that.currentWord.wordRender());
                console.log('You are a winnerYou won the game!!!');
                // that.startGame();
              } else{
                // display the user how many guesses remaining
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currentWord.wordRender());
                console.log('\n*******************');
                console.log("Letters guessed: " + that.guessedLetters);
              }
          }
          if(that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
            that.keepPromptingUser();
          }else if(that.guessesRemaining === 0){
            console.log('Game over!');
            console.log('The word you were attempting to guess was: ' + that.currentWord.word);
          }
        } else{
            console.log("You have already guess that letter already. Please try again.")
            that.keepPromptingUser();
          }
    });
  }
}

hangman.startGame();
