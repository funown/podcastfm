const random = require('random');

(
  function () {
    const types = ['letter', 'kanji', 'number'];

    function randomLetter() {
      let letters = 'abcdefghijklmnopqrstuvwxyz';
      return letters.charAt(random.int(0, letters.length));
    }
    function randomKanji() {
      return `\\u${(Math.round(Math.random() * 20901) + 19968).toString(16)}`;
    }
    function randomNumber() {
      return Math.floor(random.int(0, 9));
    }

    function randomChar() {
      switch (types[random.int(0, types.length)]) {
        case 'kanji' : return randomKanji();
        case 'number' : return randomNumber();
        default : return randomLetter();
      }
    }

    module.exports = randomChar;
  }()
);