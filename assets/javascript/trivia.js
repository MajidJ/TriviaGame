'use strict';


let timer;
let timeStart = 20;
let timeLeft = 19;
let correctAnswers = 0;
let incorrectAnswers = 0;
let questionsCompleted = 0;
let triviaQuestionOrder = [];
let currentTrivia;
// Questions are provided by Open Trivia under public domain
// The first answer choice in the answers array is the correct answer
const trivia = [{question: "Which of these bones is hardest to break?",
answers: ["Femur", "Cranium", "Humerus", "Tibia"],
explain: "The Femur is the hardest to break"},
{question: "How many objects are equivalent to one mole?",
answers: ["6.022 x 10^23", "6.002 x 10^22", "6.022 x 10^22", "6.002 x 10^23"],
explain: "6.022 x 10^23 objects are equivalent to one mole."},
{question: "What is the primary addictive substance found in tobacco?",
answers: ["Nicotine", "Cathinone", "Ephedrine", "Glaucine"],
explain: "Nicotine is the primary addictive substance found in tobacco."},
{question: "Alzheimer's disease primarily affects which part of the human body?",
answers: ["Brain", "Lungs", "Skin", "Heart"],
explain: "Alzheimer's disease primarily affects the brain."},
{question: "How many bones are in the human body?",
answers: ["206", "203", "209", "200"],
explain: "There are 206 bones in the human body."},
{question: "The asteroid belt is located between which two planets?",
answers: ["Mars and Jupiter", "Jupiter and Saturn", "Mercury and Venus", "Earth and Mars"],
explain: "The asteroid belt is located between Mars and Jupiter"},
{question: "Which is the most abundant element in the universe?",
answers: ["Hydrogen", "Helium", "Lithium", "Oxygen"],
explain: "Hydrogen is the most abundant element in the universe."},
{question: "The medical term for the belly button is which of the following?",
answers: ["Umbilicus", "Nevus", "Nares", "Paxillus"],
explain: "The medical term for the belly button is Umbilicus."},
{question: "Which element has the highest melting point?",
answers: ["Carbon", "Tungsten", "Platinum", "Osmium"],
explain: "Carbon is the element with the highest melting point."},
{question: "What is the unit of electrical resistance?",
answers: ["Ohm", "Mho", "Tesla", "Joule"],
explain: "Ohm is the unit of electrical resistance."}];


// let numberOfQuestions = "10";
// let difficulty = "easy";
// function setTrivia() {
//     for (let i = 0 ; i < parseInt(numberOfQuestions); i++) {
//         trivia.push({question: "q", answers: ["1", "2", "3", "4"]});
//     }
//     let queryURL = "https://opentdb.com/api.php?amount=" + numberOfQuestions + "&category=17&difficulty=" + difficulty + "&type=multiple";
//     $.ajax({url:queryURL, method: "GET"}).then(function(response) {
//       for (var i = 0; i < parseInt(numberOfQuestions); i++) {
//         trivia[i].question = response.results[i].question;
//         trivia[i].answers[0] = response.results[i].correct_answer;
//         for (let j = 0; j < 3; i++) {
//           trivia[i].answers[j+1] = response.results[i].incorrect_answers[j];
//           console.log(response.results[i].incorrect_answers[j]);
//         }
//       }
//     });
// };   

$(document).ready(function() {
    // setTrivia();
    triviaQuestionOrder = randomizeQuestionOrder();
    startButton(triviaQuestionOrder);
    $(".timer").text('00:' + timeStart);
    $('.start-button').on('click', function() {
        $(this).hide();
        nextQuestion();
    })
    // End of document ready function
}); 

const startTimer = function() {
    timer = setInterval(function() {
        if (timeLeft > 9) {
            $(".timer").text("00:" + timeLeft);
            timeLeft--;
        } else {
            

            $(".timer").text("00:0" + timeLeft);
            if (timeLeft === 0) {
            clearInterval(timer);
            displayTimedOutLoss();
            } else {
            timeLeft--;
            }
        }
    }, 1000);   
    // End of startTimer() 
};

const startButton = function() {
    let startButton = $('<button>');
    startButton.addClass('start-button btn');
    startButton.text('Start Game');
    $('.answers').append(startButton);
    // End of startButton()
};

const tryAgainButton = function() {
    let startButton = $('<button>');
    startButton.addClass('start-button btn');
    startButton.text('Try Again');
    $('.answers').append(startButton);
    // End of tryAgainButton()
};

const nextQuestion = function() {
    clearInterval(timer);
    startTimer();
    $('.answers').empty();
    currentTrivia = trivia[triviaQuestionOrder[questionsCompleted]];
    let currentAnswerChoices = currentTrivia.answers;
    let answerChoiceOrder = randomizeAnswerChoiceOrder(currentAnswerChoices);
    $('.question').text(currentTrivia.question);
    for (let i = 0; i < currentAnswerChoices.length; i++) {
        let answerButton = $('<button>');
        answerButton.addClass('button btn');
        answerButton.attr('value', answerChoiceOrder[i]);
        answerButton.text(currentAnswerChoices[answerChoiceOrder[i]]);
        $('.answers').append(answerButton);
    }
    $('.button').on('click', function() {
        if (parseInt($(this).val()) === 0) {
            displayWin();
        } else {
            displayLoss();
        }
    });
    // End of nextQuestion()
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
    correctAnswers++;
    resetTimer();
    $('.answers').empty();
    $('.answers').append('<img src="assets/images/checkmark.svg" width="100px">')
    $('.answers').append('</br><h3>You are correct!</h3>');
    $('.answers').append(`<h4>${currentTrivia.explain}</h4>`);
    progress();
    // End of displayWin()
};

const displayLoss = function() {
    incorrectAnswers++;
    resetTimer();
    $('.answers').empty();
    $('.answers').append('<img src="assets/images/cross.svg" width="100px">')
    $('.answers').append("</br><h3>That's incorrect</h3>");
    $('.answers').append(`<h4>${currentTrivia.explain}</h4>`);
    progress();
    // End of displayLoss()
};

const displayTimedOutLoss = function() {
    incorrectAnswers++;
    resetTimer();
    $('.answers').empty();
    $('.answers').append('<img src="assets/images/cross.svg" width="100px">')
    $('.answers').append("</br><h3>You ran out of time.</h3>");
    $('.answers').append(`<h4>${currentTrivia.explain}</h4>`);
    progress();
    // End of displayLoss()
};

const resetTimer = function() {
    clearInterval(timer);
    $('.timer').text('00:' + timeStart);
    timeLeft = 19;
    // End of resetTimer()
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
    // End of progress()    
}

const finalScreen = function() {
    $('.answers').empty();
    $('.question').empty();
    $('.question').append("Thanks for playing!");
    $('.answers').append(`<h3>Correct Answers: ${correctAnswers} </br> Incorrect Answers: ${incorrectAnswers} </h3><br>`);
    tryAgainButton();
    $('.start-button').on('click', function() {
        triviaQuestionOrder = randomizeQuestionOrder();
        questionsCompleted = 0;
        $(this).hide();
        nextQuestion();
    })
    // End of finalScreen()
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
    // End of shuffle()  
};