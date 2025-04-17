        // JavaScript Code
        document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const startScreen = document.getElementById('start-screen');
            const quizContainer = document.getElementById('quiz-container');
            const endScreen = document.getElementById('end-screen');
            const highScoresScreen = document.getElementById('high-scores-screen');
            
            const startBtn = document.getElementById('start-btn');
            const nextBtn = document.getElementById('next-btn');
            const restartBtn = document.getElementById('restart-btn');
            const goHomeBtn = document.getElementById('go-home-btn');
            const submitScoreForm = document.getElementById('submit-score');
            
            const questionElement = document.getElementById('question');
            const answerButtonsElement = document.getElementById('answer-buttons');
            const progressElement = document.getElementById('progress');
            const timeElement = document.getElementById('time');
            const finalScoreElement = document.getElementById('final-score');
            const initialsInput = document.getElementById('initials');
            const highScoresList = document.getElementById('high-scores');

            // Quiz Variables
            let shuffledQuestions, currentQuestionIndex;
            let score = 0;
            let timeLeft = 60;
            let timer;

            // Quiz Questions
            const questions = [
                {
                    question: "What is the capital of France?",
                    answers: [
                        { text: "London", correct: false },
                        { text: "Paris", correct: true },
                        { text: "Berlin", correct: false },
                        { text: "Madrid", correct: false }
                    ]
                },
                {
                    question: "Which language runs in a web browser?",
                    answers: [
                        { text: "Java", correct: false },
                        { text: "C", correct: false },
                        { text: "Python", correct: false },
                        { text: "JavaScript", correct: true }
                    ]
                },
                {
                    question: "What does HTML stand for?",
                    answers: [
                        { text: "Hypertext Markup Language", correct: true },
                        { text: "Hypertext Machine Language", correct: false },
                        { text: "Hyper Transfer Markup Language", correct: false },
                        { text: "High-level Text Management Language", correct: false }
                    ]
                },
                {
                    question: "What year was JavaScript launched?",
                    answers: [
                        { text: "1996", correct: false },
                        { text: "1995", correct: true },
                        { text: "1994", correct: false },
                        { text: "None of the above", correct: false }
                    ]
                },
                {
                    question: "Which of these is not a JavaScript framework?",
                    answers: [
                        { text: "React", correct: false },
                        { text: "Angular", correct: false },
                        { text: "Laravel", correct: true },
                        { text: "Vue", correct: false }
                    ]
                }
            ];

            // Event Listeners
            startBtn.addEventListener('click', startQuiz);
            nextBtn.addEventListener('click', () => {
                currentQuestionIndex++;
                setNextQuestion();
            });
            restartBtn.addEventListener('click', restartQuiz);
            goHomeBtn.addEventListener('click', goHome);
            submitScoreForm.addEventListener('submit', saveHighScore);

            // Functions
            function startQuiz() {
                startScreen.classList.add('hide');
                quizContainer.classList.remove('hide');
                
                shuffledQuestions = questions.sort(() => Math.random() - 0.5);
                currentQuestionIndex = 0;
                score = 0;
                timeLeft = 60;
                
                startTimer();
                setNextQuestion();
            }

            function startTimer() {
                timeElement.textContent = timeLeft;
                timer = setInterval(() => {
                    timeLeft--;
                    timeElement.textContent = timeLeft;
                    
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        endQuiz();
                    }
                }, 1000);
            }

            function setNextQuestion() {
                resetState();
                if (currentQuestionIndex >= shuffledQuestions.length) {
                    endQuiz();
                    return;
                }
                
                showQuestion(shuffledQuestions[currentQuestionIndex]);
                progressElement.textContent = `Question ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
            }

            function showQuestion(question) {
                questionElement.textContent = question.question;
                
                question.answers.forEach(answer => {
                    const button = document.createElement('button');
                    button.textContent = answer.text;
                    button.classList.add('btn-option');
                    if (answer.correct) {
                        button.dataset.correct = answer.correct;
                    }
                    button.addEventListener('click', selectAnswer);
                    answerButtonsElement.appendChild(button);
                });
            }

            function resetState() {
                nextBtn.classList.add('hide');
                while (answerButtonsElement.firstChild) {
                    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
                }
            }

            function selectAnswer(e) {
                const selectedButton = e.target;
                const correct = selectedButton.dataset.correct === 'true';
                
                if (correct) {
                    score += 10;
                } else {
                    timeLeft -= 10;
                    if (timeLeft < 0) timeLeft = 0;
                    timeElement.textContent = timeLeft;
                }
                
                Array.from(answerButtonsElement.children).forEach(button => {
                    setStatusClass(button, button.dataset.correct === 'true');
                });
                
                if (shuffledQuestions.length > currentQuestionIndex + 1) {
                    nextBtn.classList.remove('hide');
                } else {
                    setTimeout(endQuiz, 1000);
                }
            }

            function setStatusClass(element, correct) {
                clearStatusClass(element);
                if (correct) {
                    element.classList.add('correct');
                } else {
                    element.classList.add('incorrect');
                }
            }

            function clearStatusClass(element) {
                element.classList.remove('correct');
                element.classList.remove('incorrect');
            }

            function endQuiz() {
                clearInterval(timer);
                quizContainer.classList.add('hide');
                endScreen.classList.remove('hide');
                finalScoreElement.textContent = score;
            }

            function saveHighScore(e) {
                e.preventDefault();
                
                const initials = initialsInput.value.toUpperCase();
                const newScore = { initials, score };
                
                let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
                highScores.push(newScore);
                highScores.sort((a, b) => b.score - a.score);
                highScores = highScores.slice(0, 5); // Keep only top 5 scores
                
                localStorage.setItem('highScores', JSON.stringify(highScores));
                showHighScores();
            }

            function showHighScores() {
                endScreen.classList.add('hide');
                highScoresScreen.classList.remove('hide');
                
                highScoresList.innerHTML = '';
                const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
                
                highScores.forEach((score, index) => {
                    const li = document.createElement('li');
                    li.textContent = `${index + 1}. ${score.initials} - ${score.score}`;
                    highScoresList.appendChild(li);
                });
            }

            function restartQuiz() {
                endScreen.classList.add('hide');
                startQuiz();
            }

            function goHome() {
                highScoresScreen.classList.add('hide');
                startScreen.classList.remove('hide');
            }
        });
