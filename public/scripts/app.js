import { Question } from './question.js';

const quizRoom = document.querySelector('.quiz-rooms');
const quizQuestions = document.querySelector('.quiz');
const textTopicDiv = document.querySelector('.textTopic');
const confirmButton = document.querySelector('.confirm');
const retryButton = document.querySelector(".retry");
const resultDiv = document.querySelector('.result');
const resultSpan = resultDiv.querySelector('span');

let quizData = {}; 
let selectedAnswers = {};
let correctAnswers = {};

async function fetchQuizData() {
    try {
        const response = await fetch('/public/questions.json');
        quizData = await response.json();
        correctAnswers = quizData.correctAnswers;
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

async function setDefaultTopic() {
    await fetchQuizData(); 
    const defaultButton = document.querySelector('#HTML');
    if (defaultButton) {
        defaultButton.click(); 
    }
}

quizRoom.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const buttonText = e.target.textContent;
        textTopicDiv.textContent = buttonText;

        textTopicDiv.classList.remove('border-green-300', 'border-blue-300', 'border-orange-300', 'border-purple-300');

        const buttonId = e.target.getAttribute('id');
        if (buttonId === 'HTML') {
            textTopicDiv.classList.add('border-green-300');
        } else if (buttonId === 'CSS') {
            textTopicDiv.classList.add('border-blue-300');
        } else if (buttonId === 'JavaScript') {
            textTopicDiv.classList.add('border-orange-300');
        } else if (buttonId === 'GIT') {
            textTopicDiv.classList.add('border-purple-300');
        }

        if (quizData[buttonId]) {
            loadQuestions(buttonId);
        } else {
            console.error('No data available for the selected topic');
        }
    }
    resultDiv.classList.add('hidden');
});

async function loadQuestions(buttonId) {
    const questions = quizData[buttonId];
    quizQuestions.innerHTML = ''; 
    questions.forEach((questionData, index) => {
        const question = new Question(index, questionData);
        quizQuestions.appendChild(question.createQuestionElement());
    });
}

document.addEventListener('click', e => {
    if (e.target.closest('.option')) {
        const clickedOption = e.target.closest('.option');
        const questionDiv = clickedOption.closest('.list-group-item');
        
        const previousSelections = questionDiv.querySelectorAll('.selectedAnswerBG');
        previousSelections.forEach(option => option.classList.remove('selectedAnswerBG'));
        
        clickedOption.classList.add('selectedAnswerBG');
        
        const questionIndex = questionDiv.getAttribute('data-question-index');
        selectedAnswers[questionIndex] = clickedOption.getAttribute('data-option-key');
    }
});

confirmButton.addEventListener('click', () => {
    let score = 0;
    
    document.querySelectorAll('.list-group-item').forEach(questionDiv => {
        const questionIndex = questionDiv.getAttribute('data-question-index');
        const userAnswer = selectedAnswers[questionIndex];
        const correctAnswer = correctAnswers[textTopicDiv.textContent][questionIndex];
        
        const correctOption = questionDiv.querySelector(`[data-option-key="${correctAnswer}"]`);
        if (correctOption) {
            correctOption.classList.add('correctAnswerBG');
        }
        
        const selectedOption = questionDiv.querySelector('.selectedAnswerBG');
        if (selectedOption) {
            if (userAnswer === correctAnswer) {
                score += 20;
            } else {
                selectedOption.classList.add('wrongAnswerBG');
            }
        }
    });

    window.scrollTo(0,0);

    animateScore(score);

    resultDiv.classList.remove('hidden');
});

function animateScore(score) {
    let currentScore = 0;
    const interval = setInterval(() => {
        resultSpan.textContent = `${currentScore}%`;
        if (currentScore >= score) {
            clearInterval(interval);
        } else {
            currentScore += 1;
        }
    }, 10); // Puanın arttırılma hızı (ms cinsinden)
}

window.addEventListener('DOMContentLoaded', setDefaultTopic);