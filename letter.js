var Letter = function(ltr) {

  this.letter = ltr;
  this.appear = false;

  this.letterRender = function() {
    if(this.letter == ' '){ 
         this.appear = true;
      return '  ';
    }if(this.appear === false){ 
      // returns a blank space 
      return ' _ ';
    } else{ 
      return this.letter;
    }

  };
};

// export module in order to pull into the word.js file
module.exports = Letter;

