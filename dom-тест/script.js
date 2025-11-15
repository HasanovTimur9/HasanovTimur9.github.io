const questions = [
    {
        text: "А когда с человеком может произойти дрожемент?",
        answers: [
            "Когда он влюбляется",
            "Когда он идет шопиться",
            "Когда он слышит смешную шутку",
            "Когда он боится, пугается"
        ],
        correct: 3,
        explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»."
    },
    {
        text: "Говорят, Антон заовнил всех. Это еще как понимать?",
        answers: [
            "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?",
            "Антон очень надоедливый и въедливый человек, всех задолбал",
            "Молодец, Антон, всех победил!",
            "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей"
        ],
        correct: 2,
        explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»."
    },
    {
        text: "А фразу «заскамить мамонта» как понимать?",
        answers: [
            "Разозлить кого-то из родителей",
            "Увлекаться археологией",
            "Развести недотепу на деньги",
            "Оскорбить пожилого человека"
        ],
        correct: 2,
        explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца."
    },
    {
        text: "Кто такие бефефе?",
        answers: [
            "Вши?", 
            "Милые котики, такие милые, что бефефе",
            "Лучшие друзья",
            "Люди, которые не держат слово"
        ],
        correct: 2,
        explanation: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever."
    }
];

const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
let currentQuestionIndex = 0;
let correctAnswers = 0;
let answered = false;
const dynamicArea = document.getElementById('dynamic-area');
const message = document.getElementById('message');
const stats = document.getElementById('stats');
let questionBlocks = [];

function displayNextQuestion() {
    if (currentQuestionIndex >= shuffledQuestions.length) {
        message.textContent = "Вопросы закончились";
        stats.textContent = `Правильных ответов: ${correctAnswers} из ${shuffledQuestions.length}`;
        enableReviewMode();
        return;
    }

    const q = shuffledQuestions[currentQuestionIndex];
    const questionBlock = document.createElement('div');
    questionBlock.classList.add('question-block');
    questionBlock.innerHTML = `<span class="number">${currentQuestionIndex + 1}. </span>${q.text}`;
 
    questionBlock.addEventListener('click', () => {
        questionBlock.classList.add('clicked');
        setTimeout(() => questionBlock.classList.remove('clicked'), 300);
    });

    const answersDiv = document.createElement('div');
    answersDiv.classList.add('answers');

    const answerIndices = q.answers.map((_, i) => i);
    const shuffledIndices = answerIndices.sort(() => Math.random() - 0.5);
    
    const newCorrectIndex = shuffledIndices.indexOf(q.correct);

    shuffledIndices.forEach((originalIndex, displayIndex) => {
        const answer = q.answers[originalIndex];
        const answerBlock = document.createElement('div');
        answerBlock.classList.add('answer-block');
        answerBlock.textContent = `${String.fromCharCode(97 + displayIndex)}) ${answer}`;
        answerBlock.dataset.index = displayIndex;
        answerBlock.dataset.originalIndex = originalIndex;

        answerBlock.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            answerBlock.classList.add('hover');
        });
        answerBlock.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            answerBlock.classList.remove('hover');
        });
        answerBlock.addEventListener('click', (e) => {
           
            e.stopPropagation();
            if (answered) return;
            answered = true;
      
            answerBlock.classList.add('selected');
            handleAnswer(displayIndex, newCorrectIndex, questionBlock, answersDiv, q.explanation);
        });
        answersDiv.appendChild(answerBlock);
    });

    dynamicArea.appendChild(questionBlock);
    dynamicArea.appendChild(answersDiv);
    questionBlocks.push({ block: questionBlock, correctAnswer: q.answers[q.correct], explanation: q.explanation });
    currentQuestionIndex++;
}

function handleAnswer(selectedIndex, correctIndex, questionBlock, answersDiv, explanation) {
    const marker = document.createElement('span');
    marker.classList.add('marker');
    if (selectedIndex === correctIndex) {
        correctAnswers++;
        marker.textContent = 'Yes!';
        marker.classList.add('correct-marker');
        const correctBlock = answersDiv.children[correctIndex];
        correctBlock.classList.add('correct');
        const expl = document.createElement('div');
        expl.classList.add('explanation');
        expl.textContent = explanation;
        correctBlock.appendChild(expl);
    } else {
        marker.textContent = 'X';
        marker.classList.add('wrong-marker');
       
        const selectedBlock = answersDiv.children[selectedIndex];
        if (selectedBlock) {
            selectedBlock.classList.add('wrong');
        }
    }
    questionBlock.appendChild(marker);

   
    setTimeout(() => {
        Array.from(answersDiv.children).forEach(block => {
            block.classList.add('move-right');
        });
        
        setTimeout(() => {
            answersDiv.remove();
            answered = false;
            displayNextQuestion();
        }, 1100);
    }, 3000);
}

function enableReviewMode() {
    questionBlocks.forEach((q, index) => {
        q.block.addEventListener('click', () => {
            
            document.querySelectorAll('.review-explanation').forEach(el => el.remove());

            const reviewExpl = document.createElement('div');
            reviewExpl.classList.add('review-explanation');
            reviewExpl.textContent = `Правильный ответ: ${q.correctAnswer}. ${q.explanation}`;
            q.block.appendChild(reviewExpl);
        });
    });
}

displayNextQuestion();