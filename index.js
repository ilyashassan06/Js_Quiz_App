const noofQues = document.querySelector("#num-questions");
const category = document.querySelector("#category");
const diflevel = document.querySelector("#difficulty");
const startquiz = document.querySelector(".start");
const startScreen = document.querySelector(".start-screen");
const quizScreen = document.querySelector(".quiz");
var correct = new Audio('correct.mp3');
var wrong = new Audio('error.mp3');

let questions = [];

let questionIndex = 0,
score = 0;


const loadQuestion = ()=>{
  const totalQ = noofQues.value;
  const cat = category.value;
  const difficult = diflevel.value;
// console.log(cat,difficult);

// fetch questions from api
async function getData() {
  const url = `https://opentdb.com/api.php?amount=${totalQ}&category=${cat}&difficulty=${difficult}&type=multiple`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    questions = json.results;
   
  } catch (error) {
    console.error(error.message);
  }
}

 getData();

setTimeout(() => {
  if (questions.length>0) {
   
  
    startScreen.style.display = "none"
    quizScreen.style.display = "block"
    showQuestions(questions[questionIndex])
 
 
  } else {
    console.log("no questions")
  }
}, 3000);
}



const showQuestions = (question)=>{
  const questionText = document.querySelector(".question");
  const answerwrapper = document.querySelector(".answer-wrapper");
  const nq = document.querySelector(".number");
nq.innerHTML=`
Question <span class="current">${questionIndex+1}</span>
            <span class="total">/${questions.length}</span>
`
  
  // console.log(question);
let alloptions = [...question.incorrect_answers,question.correct_answer.toString()].sort(() => Math.random() - 0.5);
console.log(alloptions);
questionText.innerHTML = question.question;
answerwrapper.innerHTML = ''; 
alloptions.forEach(options => {
  answerwrapper.innerHTML += `
  <div class="answer text">${options}</div>
  `
  
});

const answersDiv = document.querySelectorAll(".answer");
answersDiv.forEach(answer => {
  answer.addEventListener('click',()=>{
    answersDiv.forEach(ans => ans.classList.remove("checked"));
    
    // Mark the clicked answer as selected
    answer.classList.add("checked");
    const submitbtn = document.querySelector(".submit");
    // submitbtn.disabled = "false"
  })
});

}


const submitbtn = document.querySelector(".submit");
const nextbtn = document.querySelector(".next");

submitbtn.addEventListener('click',()=>{
  checkAnswer();
});
nextbtn.addEventListener("click",()=>{
  nextQuestion();
    submitbtn.style.display = "block";
    nextbtn.style.display = "none";
    
  

})


const nextQuestion=()=>{
  questionIndex++;
  if (questionIndex < questions.length) {
    console.log(questions.length);
    console.log(questionIndex);
   
    showQuestions(questions[questionIndex]);

  } else {
    showScore();
  }
};

const showScore=()=>{
  const endScreen = document.querySelector(".end-screen")
  const scoree = document.querySelector(".score")
  quizScreen.style.display="none";
  endScreen.style.display="block";
  scoree.innerHTML=`
  <span class="score-text">Your score:</span>
          <div>
            <span class="final-score">${score}</span>
            <span class="total-score">/${questions.length}</span>
          </div>
  `
}

const checkAnswer = ()=>{
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach(answer => {
    answer.style.pointerEvents = "none";  // Disable clicking
  });
  const selectedAnswer = document.querySelector(".answer.checked");
  // console.log(selectedAnswer)
  if (selectedAnswer) {
    const answertext = selectedAnswer.innerHTML;
    if (answertext === questions[questionIndex].correct_answer) {
      correct.play();
      score++;
      console.log("CORRECT");
      selectedAnswer.classList.add("correct")
    } else {
      wrong.play();
      console.log("INCORRECT");
      selectedAnswer.classList.add("incorrect")
      const answersDiv = document.querySelectorAll(".answer");
      answersDiv.forEach(answer => {
        if ( answer.innerHTML === questions[questionIndex].correct_answer) {
          answer.classList.add("correct")
        }
      });
    }
  }

    
    
    

  submitbtn.style.display = "none";
  nextbtn.style.display = "block";

 }

 const restart = document.querySelector(".restart")
 restart.addEventListener("click",()=>{
  window.location.reload();
 })

startquiz.addEventListener('click',loadQuestion)
