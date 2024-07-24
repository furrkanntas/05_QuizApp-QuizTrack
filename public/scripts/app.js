import { Question } from './question.js';

const quizRoom = document.querySelector('.quiz-rooms');
const quizQuestions = document.querySelector('.quiz');
const textTopicDiv = document.querySelector('.textTopic');

let quizData = {}; 

async function fetchQuizData() {
    try {
        const response = await fetch('/public/questions.json');
        quizData = await response.json();
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
});

async function loadQuestions(buttonId) {
    const questions = quizData[buttonId];
    quizQuestions.innerHTML = ''; // Önceki soruları temizle
    questions.forEach((questionData, index) => {
        const question = new Question(index, questionData);
        quizQuestions.appendChild(question.createQuestionElement());
    });
}

window.addEventListener('load', setDefaultTopic);