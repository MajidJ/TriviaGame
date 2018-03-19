'use strict';

let questionsCompleted = 0;
let triviaQuestionOrder = [];
const trivia = [{question: "Is this yo?",
answers: ["Yo", "Go", "Bo", "No"]},
{question: "Is this night?",
answers: ["night", "fight", "sight", "might"]},
{question: "Who is the first President?",
answers: ["George Washington", "John Hancock", "Thomas Jefferson", "Benjamin Franklin"]},
{question: "Is this dime?",
answers: ["dime", "chime", "sublime", "crime"]}
];
let timer;
let timeStart = 10;
let timeLeft = 9;

$(document).ready(function() {
    triviaQuestionOrder = randomizeQuestionOrder();
    startScreen(triviaQuestionOrder);
    $(".timer").text('00:' + timeStart);
    $('.start-button').on('click', function() {
        $(this).hide();
        nextQuestion();
    })

});

const startTimer = function() {
    timer = setInterval(function() {  
      $(".timer").text("00:0" + timeLeft);
      if (timeLeft === 0) {
        clearInterval(timer);
        displayLoss();
      } else {
        timeLeft--;
      }
    }, 1000);
  }

const startScreen = function() {
    let startButton = $('<button>');
    startButton.addClass('start-button btn btn-primary');
    startButton.text('Start Game');
    $('.answers').append(startButton);
};

const nextQuestion = function() {
    clearInterval(timer);
    startTimer();
    $('.answers').empty();
    let currentTrivia = trivia[triviaQuestionOrder[questionsCompleted]];
    let currentAnswerChoices = currentTrivia.answers;
    let answerChoiceOrder = randomizeAnswerChoiceOrder(currentAnswerChoices);
    $('.question').text(currentTrivia.question);
    for (let i = 0; i < currentAnswerChoices.length; i++) {
        let answerButton = $('<button>');
        answerButton.addClass('button btn btn-primary');
        answerButton.attr('value', answerChoiceOrder[i]);
        answerButton.text(currentAnswerChoices[answerChoiceOrder[i]]);
        $('.answers').append(answerButton);
    }
    $('.button').on('click', function() {
        // console.log(typeof parseInt($(this).val()), parseInt($(this).val()) === 0);
        if (parseInt($(this).val()) === 0) {
            displayWin();
        } else {
            displayLoss();
        }
    });
};







const randomizeQuestionOrder = function() {
    let questionNumbers = [];
    for (let i = 0; i < trivia.length; i++) {
        questionNumbers[i] = i;
    }
    shuffle(questionNumbers);
    return questionNumbers;
    // End of randomizeQuestionOrder()
};

const randomizeAnswerChoiceOrder = function(currentAnswerChoiceArray) {
    let answerNumbers = [];
    for (let i = 0; i < currentAnswerChoiceArray.length; i++) {
        answerNumbers[i] = i;
    }
    shuffle(answerNumbers);
    return answerNumbers;
    // End of randomizeAnswerChoiceOrder() 
};

const displayWin = function() {
    resetTimer();
    $('.answers').empty();
    $('.answers').append('You are right.');
    progress();
};

const displayLoss = function() {
    resetTimer();
    $('.answers').empty();
    $('.answers').append('You are wrong.');
    progress();
};

const resetTimer = function() {
    clearInterval(timer);
    $('.timer').text('00:' + timeStart);
    timeLeft = 9;
    $('.answers').text('00:0' + timeLeft)
}

const progress = function() {
    questionsCompleted++;
    if (questionsCompleted < trivia.length) {
        setTimeout(function () {
            nextQuestion();
        }, 3000);
    } else {
        setTimeout(function () {
            finalScreen();
        }, 3000);
    }
    
}

const finalScreen = function() {
    $('.answers').empty();
    $('.answers').append('You are great I guess.');
};



// Fisher-Yates shuffle function. source: http://sedition.com/perl/javascript-fy.html
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
};