// Online Examination System - JavaScript Code

// Exam questions data
const examQuestions = [
    {
        id: 1,
        text: "Which data structure uses LIFO (Last In First Out) principle?",
        options: [
            { id: 'a', text: "Queue" },
            { id: 'b', text: "Stack" },
            { id: 'c', text: "Array" },
            { id: 'd', text: "Linked List" }
        ],
        correctAnswer: 'b'
    },
    {
        id: 2,
        text: "What is the time complexity of binary search algorithm?",
        options: [
            { id: 'a', text: "O(n)" },
            { id: 'b', text: "O(n log n)" },
            { id: 'c', text: "O(log n)" },
            { id: 'd', text: "O(1)" }
        ],
        correctAnswer: 'c'
    },
    {
        id: 3,
        text: "Which of the following is not a programming paradigm?",
        options: [
            { id: 'a', text: "Object-Oriented Programming" },
            { id: 'b', text: "Functional Programming" },
            { id: 'c', text: "Procedural Programming" },
            { id: 'd', text: "Linear Programming" }
        ],
        correctAnswer: 'd'
    },
    {
        id: 4,
        text: "In a relational database, a foreign key is used to:",
        options: [
            { id: 'a', text: "Uniquely identify a record" },
            { id: 'b', text: "Establish a relationship between tables" },
            { id: 'c', text: "Sort records in ascending order" },
            { id: 'd', text: "Create a backup of the table" }
        ],
        correctAnswer: 'b'
    },
    {
        id: 5,
        text: "Which protocol is used for secure communication over a computer network?",
        options: [
            { id: 'a', text: "HTTP" },
            { id: 'b', text: "FTP" },
            { id: 'c', text: "HTTPS" },
            { id: 'd', text: "SMTP" }
        ],
        correctAnswer: 'c'
    }
];

// Global variables
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
const examDuration = 5 * 60; // 5 minutes in seconds

// DOM elements
const questionsContainer = document.getElementById('questions-container');
const timerElement = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const answeredCountElement = document.getElementById('answered-count');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');

// Initialize the exam when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeExam();
    startTimer();
    setupEventListeners();
});

/**
 * Initializes the exam by rendering all questions
 */
function initializeExam() {
    // Create HTML for each question
    examQuestions.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.id = `question-${question.id}`;
        questionCard.style.display = index === 0 ? 'block' : 'none'; // Show only first question
        
        // Create question header with number and status
        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';
        
        const questionNumber = document.createElement('div');
        questionNumber.className = 'question-number';
        questionNumber.textContent = question.id;
        
        const questionStatus = document.createElement('div');
        questionStatus.className = 'question-status';
        questionStatus.id = `status-${question.id}`;
        questionStatus.textContent = 'Not Answered';
        
        questionHeader.appendChild(questionNumber);
        questionHeader.appendChild(questionStatus);
        
        // Create question text
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = question.text;
        
        // Create options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        // Create each option
        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.questionId = question.id;
            optionElement.dataset.optionId = option.id;
            
            const optionLabel = document.createElement('div');
            optionLabel.className = 'option-label';
            optionLabel.textContent = option.id.toUpperCase();
            
            const optionText = document.createElement('div');
            optionText.className = 'option-text';
            optionText.textContent = option.text;
            
            optionElement.appendChild(optionLabel);
            optionElement.appendChild(optionText);
            
            // Add click event to select option
            optionElement.addEventListener('click', () => selectAnswer(question.id, option.id));
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Assemble the question card
        questionCard.appendChild(questionHeader);
        questionCard.appendChild(questionText);
        questionCard.appendChild(optionsContainer);
        
        questionsContainer.appendChild(questionCard);
    });
    
    // Update progress bar
    updateProgressBar();
}

/**
 * Sets up event listeners for navigation and submission
 */
function setupEventListeners() {
    // Previous button
    prevButton.addEventListener('click', showPreviousQuestion);
    
    // Next button
    nextButton.addEventListener('click', showNextQuestion);
    
    // Submit button
    submitButton.addEventListener('click', submitExam);
    
    // Initialize button states
    updateNavigationButtons();
}

/**
 * Starts the countdown timer
 */
function startTimer() {
    let timeLeft = examDuration;
    
    // Update timer every second
    timerInterval = setInterval(() => {
        timeLeft--;
        
        // Calculate minutes and seconds
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        // Format time as MM:SS
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change timer color when less than 1 minute remains
        if (timeLeft < 60) {
            timerElement.parentElement.style.backgroundColor = '#ff6b6b';
        }
        
        // If time is up, auto-submit
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

/**
 * Handles answer selection for a question
 * @param {number} questionId - The ID of the question
 * @param {string} optionId - The ID of the selected option
 */
function selectAnswer(questionId, optionId) {
    // Store the user's answer
    userAnswers[questionId] = optionId;
    
    // Update the UI for the selected question
    updateQuestionUI(questionId, optionId);
    
    // Update progress
    updateProgressBar();
    updateAnsweredCount();
    
    // Update navigation buttons
    updateNavigationButtons();
}

/**
 * Updates the UI for a question after an answer is selected
 * @param {number} questionId - The ID of the question
 * @param {string} optionId - The ID of the selected option
 */
function updateQuestionUI(questionId, optionId) {
    // Update status text
    const statusElement = document.getElementById(`status-${questionId}`);
    statusElement.textContent = 'Answered';
    statusElement.classList.add('answered');
    
    // Remove 'selected' class from all options for this question
    const questionCard = document.getElementById(`question-${questionId}`);
    const allOptions = questionCard.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add 'selected' class to the chosen option
    const selectedOption = questionCard.querySelector(`[data-option-id="${optionId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
}

/**
 * Updates the progress bar based on answered questions
 */
function updateProgressBar() {
    const answeredCount = Object.keys(userAnswers).length;
    const totalQuestions = examQuestions.length;
    const progressPercentage = (answeredCount / totalQuestions) * 100;
    
    // Update progress bar width
    progressBar.style.setProperty('--progress-width', `${progressPercentage}%`);
    
    // Update progress text
    progressText.textContent = `${Math.round(progressPercentage)}% Complete (${answeredCount}/${totalQuestions} answered)`;
    
    // Update the progress bar pseudo-element
    const afterElement = progressBar.querySelector('::after') || progressBar;
    afterElement.style.width = `${progressPercentage}%`;
    
    // Direct DOM manipulation for progress bar fill
    const progressFill = document.createElement('div');
    progressFill.id = 'progress-fill';
    progressFill.style.height = '100%';
    progressFill.style.width = `${progressPercentage}%`;
    progressFill.style.background = 'linear-gradient(90deg, #3498db, #2ecc71)';
    progressFill.style.borderRadius = '5px';
    progressFill.style.transition = 'width 0.5s ease';
    
    // Remove existing fill and add new one
    const existingFill = progressBar.querySelector('#progress-fill');
    if (existingFill) {
        existingFill.remove();
    }
    progressBar.appendChild(progressFill);
}

/**
 * Updates the answered questions count
 */
function updateAnsweredCount() {
    const answeredCount = Object.keys(userAnswers).length;
    answeredCountElement.textContent = answeredCount;
}

/**
 * Shows the next question
 */
function showNextQuestion() {
    if (currentQuestionIndex < examQuestions.length - 1) {
        // Hide current question
        document.getElementById(`question-${examQuestions[currentQuestionIndex].id}`).style.display = 'none';
        
        // Show next question
        currentQuestionIndex++;
        document.getElementById(`question-${examQuestions[currentQuestionIndex].id}`).style.display = 'block';
        
        // Update navigation buttons
        updateNavigationButtons();
    }
}

/**
 * Shows the previous question
 */
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        // Hide current question
        document.getElementById(`question-${examQuestions[currentQuestionIndex].id}`).style.display = 'none';
        
        // Show previous question
        currentQuestionIndex--;
        document.getElementById(`question-${examQuestions[currentQuestionIndex].id}`).style.display = 'block';
        
        // Update navigation buttons
        updateNavigationButtons();
    }
}

/**
 * Updates the state of navigation buttons
 */
function updateNavigationButtons() {
    // Previous button
    prevButton.disabled = currentQuestionIndex === 0;
    
    // Next button
    nextButton.disabled = currentQuestionIndex === examQuestions.length - 1;
    
    // If it's the last question, change next button to "Review"
    if (currentQuestionIndex === examQuestions.length - 1) {
        nextButton.innerHTML = 'Review <i class="fas fa-check-double"></i>';
    } else {
        nextButton.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

/**
 * Handles exam submission
 */
function submitExam() {
    // Stop the timer
    clearInterval(timerInterval);
    
    // Calculate score
    const totalQuestions = examQuestions.length;
    let score = 0;
    
    examQuestions.forEach(question => {
        if (userAnswers[question.id] === question.correctAnswer) {
            score++;
        }
    });
    
    // Prepare summary message
    let summaryMessage = `Exam Submitted!\n\n`;
    summaryMessage += `Time Remaining: ${timerElement.textContent}\n`;
    summaryMessage += `Questions Answered: ${Object.keys(userAnswers).length}/${totalQuestions}\n`;
    summaryMessage += `Score: ${score}/${totalQuestions}\n\n`;
    summaryMessage += `Your Answers:\n`;
    
    // Add each question and selected answer to summary
    examQuestions.forEach(question => {
        const userAnswer = userAnswers[question.id] || 'Not Answered';
        const isCorrect = userAnswer === question.correctAnswer;
        const status = isCorrect ? '✓' : '✗';
        
        summaryMessage += `Q${question.id}: ${userAnswer.toUpperCase()} ${status}\n`;
    });
    
    summaryMessage += `\nThank you for completing the exam!`;
    
    // Show summary alert
    alert(summaryMessage);
    
    // Disable further interactions
    submitButton.disabled = true;
    submitButton.textContent = 'Exam Submitted';
    submitButton.style.backgroundColor = '#95a5a6';
    
    // Disable option selection
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

// Make sure the progress bar is initialized
updateProgressBar();