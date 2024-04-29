const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start");
const numQuestion = document.querySelector("#num");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");
const quiz = document.querySelector(".quiz");
const startScreen = document.querySelector(".start-screen");

let questions=[];
let time=30;
let score=0;
let currQuestion=0;
let timer;

const startQuiz = () => {
    const num = numQuestion.value;
    const cat = category.value;
    const diff = difficulty.value;
    loadingAnimation();
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;
            startScreen.classList.add("hide");
            quiz.classList.remove("hide");
            showQuestion();
        })
        .catch((error) => {
            console.error('Error fetching questions:', error);
        });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = () => {
    const questionText = document.querySelector(".question");
    const answersWrapper = document.querySelector(".answers-wrapper");
    const questionNumber = document.querySelector(".number");

    questionText.innerHTML = questions[currQuestion].question;

    const answers = [
        ...questions[currQuestion].incorrect_answers,
        questions[currQuestion].correct_answer,
    ];
    answers.sort(() => Math.random() - 0.5);
    answersWrapper.innerHTML = "";
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `<div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <i class="fas fa-check"></i>
        </span>
      </div>`;
    });
    questionNumber.innerHTML = `Question <span class="current">${currQuestion + 1}</span> <span class="total">/${questions.length}</span>`;

    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!answer.classList.contains("checked")) {
                answerDiv.forEach((ans) => {
                    ans.classList.remove("selected");
                });
                answer.classList.add("selected");
                document.querySelector(".submit").disabled = false;
            }
        });
    });
    time = timePerQuestion.value;
    startTimer(time);
};

const startTimer = (time) => {
    timer = setInterval(() => {
        if (time === 3) {
            playAudio("countdown.mp3");
        }
        if (time >= 0) {
            progress(time);
            time--;
        } else {
            checkAnswer();
        }
    }, 1000);
};

const loadingAnimation = () => {
    startBtn.innerHTML = "Loading";
    const loadingInterval = setInterval(() => {
        if (startBtn.innerHTML.length === 10) {
            startBtn.innerHTML = "Loading";
        } else {
            startBtn.innerHTML += ".";
        }
    }, 500);
};

const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

nextBtn.addEventListener("click", () => {
    nextQuestion();
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
});

const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");
    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text").innerHTML;
        if (answer === questions[currQuestion].correct_answer) {
            score++;
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");
            document.querySelectorAll(".answer").forEach((ans) => {
                if (ans.querySelector(".text").innerHTML === questions[currQuestion].correct_answer) {
                    ans.classList.add("correct");
                }
            });
        }
    } else {
        document.querySelectorAll(".answer").forEach((ans) => {
            if (ans.querySelector(".text").innerHTML === questions[currQuestion].correct_answer) {
                ans.classList.add("correct");
            }
        });
    }

    document.querySelectorAll(".answer").forEach((ans) => {
        ans.classList.add("checked");
    });
    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

const nextQuestion = () => {
    if (currQuestion < questions.length - 1) {
        currQuestion++;
        showQuestion();
    } else {
        showScore();
    }
};

const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

const playAudio = (src) => {
    const audio = new Audio(src);
    audio.play();
};
