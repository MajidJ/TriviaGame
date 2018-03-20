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


// This commented out code was from me trying to get an API call to work with my variables

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

// When the page loads 
$(document).ready(function() {
    // Uses randomizeQuestionOrder function to randomize the order of the upcoming questions 
    // It also makes sure no question is repeated over the course of the game
    triviaQuestionOrder = randomizeQuestionOrder();
    // Place start button to DOM and starts the game when the button is pressed
    startButton(triviaQuestionOrder);
    $(".timer").text('00:' + timeStart);
    $('.start-button').on('click', function() {
        $(this).hide();
        nextQuestion();
    })
    // End of document ready function
}); 

// Creates and appends the start button for the game
const startButton = function() {
    let startButton = $('<button>');
    startButton.addClass('start-button btn');
    startButton.text('Start Game');
    $('.answers').append(startButton);
    // End of startButton()
};

// Similar to the start button but with 'Try Again' button text. To be displayed once the game has finished.
const tryAgainButton = function() {
    let startButton = $('<button>');
    startButton.addClass('start-button btn');
    startButton.text('Try Again');
    $('.answers').append(startButton);
    // End of tryAgainButton()
};


// Starts the timer and checks if the time has run out for that question
// Note: There is specific DOM text formating for numbers under 10 
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


// Trivia game logic for each question that appears
const nextQuestion = function() {
    // Resets the timer for the new question
    clearInterval(timer);
    startTimer();
    // Clears out DOM for new question 
    $('.answers').empty();
    // triviaQuestionOrder contains the randomized number order that was determined at the start of game 
    // questionsCompleted keeps track of which question in that order we are currently on
    // trivia array is what contains all the content of questions and answers
    // currentTrivia is assigned the specific question and answers that we are currently focused on
    currentTrivia = trivia[triviaQuestionOrder[questionsCompleted]];
    // currentAnswerChoices is assigned the specific answers to the question we are currently focused on
    let currentAnswerChoices = currentTrivia.answers;
    // Like how we randomized the question order for the whole game, we are randomizing the answer order within each question
    let answerChoiceOrder = randomizeAnswerChoiceOrder(currentAnswerChoices);
    // Append question and buttons to the DOM
    $('.question').text(currentTrivia.question);
    for (let i = 0; i < currentAnswerChoices.length; i++) {
        let answerButton = $('<button>');
        answerButton.addClass('button btn');
        answerButton.attr('value', answerChoiceOrder[i]);
        answerButton.text(currentAnswerChoices[answerChoiceOrder[i]]);
        $('.answers').append(answerButton);
    }
    // Listen for which button is clicked and if the button is the correct answer
    // Note: all correct answers in the trivia array were at index zero
    // So if the value of the answer button is zero, we know the correct answer was clicked
    $('.button').on('click', function() {
        if (parseInt($(this).val()) === 0) {
            displayWin();
        } else {
            displayLoss();
        }
    });
    // End of nextQuestion()
};


// Determine the random order of questions for the entire game. 
// No number is repeated in this order, therefore no question is repeated in a single game
const randomizeQuestionOrder = function() {
    // Creates an array that contains numbers 1 through (the total number of trivia questions)
    let questionNumbers = [];
    for (let i = 0; i < trivia.length; i++) {
        questionNumbers[i] = i;
    }
    // Shuffles around all the numbers. 
    shuffle(questionNumbers);
    return questionNumbers;
    // End of randomizeQuestionOrder()
};

// Like how we randomized the question order for the whole game, we are randomizing the answer order within each question
const randomizeAnswerChoiceOrder = function(currentAnswerChoiceArray) {
    let answerNumbers = [];
    for (let i = 0; i < currentAnswerChoiceArray.length; i++) {
        answerNumbers[i] = i;
    }
    shuffle(answerNumbers);
    return answerNumbers;
    // End of randomizeAnswerChoiceOrder() 
};

// The page that loads when the player clicks the correct answer
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


// The page that loads when the player clicks the incorrect answer
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

// The page that loads when the player fails to answer within the time limit
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

// Reset the timer for the new question
const resetTimer = function() {
    clearInterval(timer);
    $('.timer').text('00:' + timeStart);
    timeLeft = 19;
    // End of resetTimer()
}

// Make sure that the next question auto prompts after we display the answer from the previous question
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

// Final screen that displays with the final score of correct and incorrect answers
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
// Moves items around within an array in a manner that doesn't take forever load
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