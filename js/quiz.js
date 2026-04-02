// Quiz System
const quizData = [
  {
    question: "What's your combat style?",
    answers: [
      { text: "All-out aggressive offense", element: "flame", points: 1 },
      { text: "Swift, tactical strikes", element: "wind", points: 1 },
      { text: "Strategic patience", element: "shadow", points: 1 }
    ]
  },
  {
    question: "How do you handle challenge?",
    answers: [
      { text: "Force through with power", element: "flame", points: 1 },
      { text: "Adapt and overcome", element: "wind", points: 1 },
      { text: "Analyze and outsmart", element: "shadow", points: 1 }
    ]
  },
  {
    question: "Your ideal warrior trait?",
    answers: [
      { text: "Unstoppable power", element: "flame", points: 1 },
      { text: "Perfect precision", element: "wind", points: 1 },
      { text: "Ultimate cunning", element: "shadow", points: 1 }
    ]
  },
  {
    question: "What inspires you most?",
    answers: [
      { text: "Rebirth from destruction", element: "flame", points: 1 },
      { text: "Freedom and movement", element: "wind", points: 1 },
      { text: "Control and mastery", element: "shadow", points: 1 }
    ]
  },
  {
    question: "Your weakness to overcome?",
    answers: [
      { text: "Reckless aggression", element: "flame", points: 1 },
      { text: "Consistency", element: "wind", points: 1 },
      { text: "Isolation", element: "shadow", points: 1 }
    ]
  }
];

const characterResults = {
  flame: {
    name: "Kael Ignivar",
    title: "The Ember Warden",
    element: "Flame",
    emoji: "🔥",
    description: "You are Kael Ignivar, wielder of destructive flame. Your power is legendary, your passion unstoppable. You harness pure energy to overcome all obstacles.",
    traits: ["Aggressive", "Powerful", "Passionate", "Resilient"]
  },
  wind: {
    name: "Aelith Stormborne",
    title: "The Wind Sentinel",
    element: "Wind",
    emoji: "🌪️",
    description: "You are Aelith Stormborne, master of swift precision. Your tactical mind and lightning reflexes make you formidable in any situation.",
    traits: ["Quick-Witted", "Adaptable", "Precise", "Intelligent"]
  },
  shadow: {
    name: "Morvyn Shadeveil",
    title: "The Silent Eclipse",
    element: "Shadow",
    emoji: "🌑",
    description: "You are Morvyn Shadeveil, strategist of the void. Your cunning surpasses all expectations, and your wisdom guides your every move.",
    traits: ["Strategic", "Mysterious", "Wise", "Composed"]
  }
};

let currentQuestion = 0;
let scores = { flame: 0, wind: 0, shadow: 0 };

function startQuiz() {
  currentQuestion = 0;
  scores = { flame: 0, wind: 0, shadow: 0 };
  showQuestion();
}

function showQuestion() {
  const quizContent = document.getElementById("quiz-content");
  const question = quizData[currentQuestion];

  let html = `
    <div class="quiz-question-container">
      <h3 class="quiz-question">${question.question}</h3>
      <div class="quiz-answers">
  `;

  question.answers.forEach((answer, index) => {
    html += `
      <label class="quiz-answer-option">
        <input type="radio" name="answer" value="${index}">
        <span>${answer.text}</span>
      </label>
    `;
  });

  html += `
      </div>
      <div class="quiz-buttons">
        <button class="quiz-next-btn" onclick="handleAnswer()">Next</button>
      </div>
      <div class="quiz-progress">${currentQuestion + 1} / ${quizData.length}</div>
    </div>
  `;

  quizContent.innerHTML = html;
}

function handleAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');

  if (!selected) {
    alert("Please select an answer");
    return;
  }

  const question = quizData[currentQuestion];
  const answer = question.answers[selected.value];

  scores[answer.element] += answer.points;

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const result = Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );
  const winner = result[0];
  const character = characterResults[winner];

  const resultModalBody = `
    <div class="quiz-result-display">
      <div class="result-header">
        <div class="result-emoji">${character.emoji}</div>
        <h2>${character.name}</h2>
        <p class="result-title">${character.title}</p>
      </div>
      <div class="result-description">
        <p>${character.description}</p>
      </div>
      <div class="result-traits">
        <h4>Your Traits:</h4>
        <div class="traits-list">
          ${character.traits.map(t => `<span class="trait">${t}</span>`).join("")}
        </div>
      </div>
      <div class="result-actions">
        <button onclick="location.href='../index.html#characters'">View Character</button>
        <button onclick="retakeQuiz()">Retake Quiz</button>
      </div>
    </div>
  `;

  document.getElementById("quiz-result-body").innerHTML = resultModalBody;
  document.getElementById("quiz-result-modal").classList.remove("hidden");
}

function retakeQuiz() {
  document.getElementById("quiz-result-modal").classList.add("hidden");
  startQuiz();
}

function closeQuizModal() {
  document.getElementById("quiz-result-modal").classList.add("hidden");
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start-quiz-btn");
  if (startBtn) {
    startBtn.addEventListener("click", startQuiz);
  }

  const closeBtn = document.getElementById("quiz-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeQuizModal);
  }
});
