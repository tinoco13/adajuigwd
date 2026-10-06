// ----------------------------------------------------
// 1. Mobile Menu Toggle
// ----------------------------------------------------
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// ----------------------------------------------------
// 2. Countdown Timer
// ----------------------------------------------------
let targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
        document.getElementById('cd-days').innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById('cd-hours').innerText = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById('cd-mins').innerText = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById('cd-secs').innerText = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    }
}, 1000);

// ----------------------------------------------------
// 3. Trophy Filter
// ----------------------------------------------------
function filterTrophies(category, event) {
    const cards = document.querySelectorAll('.trophy-card');
    const btns = document.querySelectorAll('.trophy-btn');

    btns.forEach(btn => {
        btn.classList.remove('bg-amber-500', 'text-black');
        btn.classList.add('bg-zinc-900', 'text-zinc-400');
    });

    if (event && event.currentTarget) {
        event.currentTarget.classList.remove('bg-zinc-900', 'text-zinc-400');
        event.currentTarget.classList.add('bg-amber-500', 'text-black');
    }

    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ----------------------------------------------------
// 4. Standings Table Simulator
// ----------------------------------------------------
let currentPts = 62;
let currentGames = 30;
let currentWins = 18;
let currentSG = 24;

function simualteGame(result) {
    currentGames++;
    if (result === 'win') {
        currentPts += 3;
        currentWins += 1;
        currentSG += 2;
    } else if (result === 'draw') {
        currentPts += 1;
    }
    updateStandingsUI();
}

function resetSimulation() {
    currentPts = 62;
    currentGames = 30;
    currentWins = 18;
    currentSG = 24;
    updateStandingsUI();
}

function updateStandingsUI() {
    document.getElementById('timao-pts').innerText = currentPts;
    document.getElementById('timao-j').innerText = currentGames;
    document.getElementById('timao-v').innerText = currentWins;
    document.getElementById('timao-sg').innerText = '+' + currentSG;
}

// ----------------------------------------------------
// 5. Web Audio API - Sound Synthesizer
// ----------------------------------------------------
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playBumbo() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
}

function playCaixa() {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
}

function playPalmas() {
    playCaixa();
    setTimeout(playCaixa, 60);
}

let isLooping = false;
let loopInterval = null;

function toggleSambaLoop() {
    const btnText = document.getElementById('loop-btn-text');
    if (isLooping) {
        clearInterval(loopInterval);
        isLooping = false;
        btnText.innerText = 'LIGAR BATERIA DA GAVIÕES (LOOP)';
    } else {
        isLooping = true;
        btnText.innerText = 'PARAR BATERIA';
        let beat = 0;
        loopInterval = setInterval(() => {
            if (beat % 2 === 0) playBumbo();
            if (beat % 4 === 1 || beat % 4 === 3) playCaixa();
            beat++;
        }, 200);
    }
}

// ----------------------------------------------------
// 6. Interactive Quiz Engine
// ----------------------------------------------------
const quizData = [
    {
        q: "Em que ano o Sport Club Corinthians Paulista foi fundado?",
        options: ["1910", "1912", "1908", "1914"],
        correct: 0,
        explain: "O Corinthians foi fundado em 1º de setembro de 1910 no bairro do Bom Retiro."
    },
    {
        q: "Quem fez o histórico gol do título paulista de 1977 encorando o jejum?",
        options: ["Sócrates", "Basílio", "Rivellino", "Wladimir"],
        correct: 1,
        explain: "Basílio marcou aos 36 minutos do segundo tempo contra a Ponte Preta."
    },
    {
        q: "Qual técnico comandou o Corinthians na conquista da Libertadores e Mundial de 2012?",
        options: ["Mano Menezes", "Vanderlei Luxemburgo", "Tite", "Oswaldo de Oliveira"],
        correct: 2,
        explain: "Tite foi o comandante genial da era vitoriosa em 2012."
    },
    {
        q: "Quem foi o herói com defesas milagrosas no Mundial de 2012 contra o Chelsea?",
        options: ["Dida", "Ronaldo Giovanelli", "Cássio", "Júlio César"],
        correct: 2,
        explain: "Cássio fez defesas históricas e foi eleito o melhor jogador do Mundial."
    },
    {
        q: "Qual movimento liderado por Sócrates e Casagrande marcou os anos 80?",
        options: ["Invasão Fiel", "Democracia Corinthiana", "Fiel Torcida", "Bando de Loucos"],
        correct: 1,
        explain: "A Democracia Corinthiana unia futebol e engajamento político e social."
    }
];

let currentQ = 0;
let quizScore = 0;

function loadQuizQuestion() {
    const q = quizData[currentQ];
    document.getElementById('quiz-progress').innerText = `Pergunta ${currentQ + 1} de ${quizData.length}`;
    document.getElementById('quiz-question').innerText = q.q;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('quiz-next-btn').classList.add('hidden');

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "w-full p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-left text-sm font-bold text-zinc-200 transition";
        btn.innerText = opt;
        btn.onclick = () => selectQuizAnswer(idx);
        optionsContainer.appendChild(btn);
    });
}

function selectQuizAnswer(selectedIndex) {
    const q = quizData[currentQ];
    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.remove('hidden');

    const optionBtns = document.getElementById('quiz-options').children;
    for (let btn of optionBtns) {
        btn.disabled = true;
    }

    if (selectedIndex === q.correct) {
        quizScore++;
        feedback.className = "p-4 rounded-xl text-sm font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800";
        feedback.innerText = "✨ Resposta Correta! " + q.explain;
    } else {
        feedback.className = "p-4 rounded-xl text-sm font-bold bg-red-950/80 text-red-300 border border-red-800";
        feedback.innerText = "❌ Incorreto. " + q.explain;
    }

    document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function nextQuestion() {
    currentQ++;
    if (currentQ < quizData.length) {
        loadQuizQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="text-center py-8 space-y-4">
            <i class="fa-solid fa-trophy text-6xl text-amber-400"></i>
            <h4 class="font-bebas text-4xl text-white">QUIZ CONCLUÍDO!</h4>
            <p class="text-lg text-zinc-300">Você acertou <strong class="text-amber-400">${quizScore}</strong> de 5 perguntas.</p>
            <button onclick="resetQuiz()" class="mt-4 px-6 py-3 bg-amber-500 text-black font-extrabold rounded-xl hover:bg-amber-400 transition">
                Tentar Novamente
            </button>
        </div>
    `;
}

function resetQuiz() {
    currentQ = 0;
    quizScore = 0;
    loadQuizQuestion();
}

loadQuizQuestion();

// ----------------------------------------------------
// 7. Tactical Pitch Squad Builder
// ----------------------------------------------------
const legendsList = ["Sócrates", "Cássio", "Marcelinho", "Neto", "Rivellino", "Ronaldo", "Wladimir", "Luizão", "Chicão", "Paulinho", "Rincón", "Vampeta", "Elias", "Danilo", "Emerson Sheik", "Guerrero"];
let activePosKey = null;

function openPlayerPicker(posKey) {
    activePosKey = posKey;
    const modal = document.getElementById('player-modal');
    const list = document.getElementById('modal-player-list');
    list.innerHTML = '';

    legendsList.forEach(player => {
        const item = document.createElement('button');
        item.className = "w-full p-3 bg-zinc-950 hover:bg-amber-500 hover:text-black font-bold text-sm text-left rounded-xl transition text-zinc-200";
        item.innerText = player;
        item.onclick = () => {
            document.getElementById(`pos-${activePosKey}`).innerText = player;
            closePlayerModal();
        };
        list.appendChild(item);
    });

    modal.classList.remove('hidden');
}

function closePlayerModal() {
    document.getElementById('player-modal').classList.add('hidden');
}

function loadPreset(presetKey) {
    if (presetKey === '2012') {
        document.getElementById('pos-GOL').innerText = "Cássio";
        document.getElementById('pos-LD').innerText = "Alessandro";
        document.getElementById('pos-ZAG1').innerText = "Chicão";
        document.getElementById('pos-ZAG2').innerText = "Paulo André";
        document.getElementById('pos-LE').innerText = "Fábio Santos";
        document.getElementById('pos-VOL').innerText = "Ralf";
        document.getElementById('pos-MEI1').innerText = "Paulinho";
        document.getElementById('pos-MEI2').innerText = "Danilo";
        document.getElementById('pos-PE').innerText = "Emerson Sheik";
        document.getElementById('pos-CA').innerText = "Guerrero";
        document.getElementById('pos-PD').innerText = "Jorge Henrique";
    } else if (presetKey === '1999') {
        document.getElementById('pos-GOL').innerText = "Dida";
        document.getElementById('pos-LD').innerText = "Indio";
        document.getElementById('pos-ZAG1').innerText = "Gamarra";
        document.getElementById('pos-ZAG2').innerText = "Nenê";
        document.getElementById('pos-LE').innerText = "Kléber";
        document.getElementById('pos-VOL').innerText = "Rincón";
        document.getElementById('pos-MEI1').innerText = "Vampeta";
        document.getElementById('pos-MEI2').innerText = "Marcelinho";
        document.getElementById('pos-PE').innerText = "Ricardinho";
        document.getElementById('pos-CA').innerText = "Luizão";
        document.getElementById('pos-PD').innerText = "Edílson";
    }
}

function resetPitch() {
    const positions = ['GOL', 'LD', 'ZAG1', 'ZAG2', 'LE', 'VOL', 'MEI1', 'MEI2', 'PE', 'CA', 'PD'];
    positions.forEach(pos => {
        document.getElementById(`pos-${pos}`).innerText = "ESCOLHER";
    });
}

// ----------------------------------------------------
// 8. Poll Voting Engine
// ----------------------------------------------------
let pollVotes = [420, 350, 150, 80];

function votePoll(idx) {
    pollVotes[idx] += 10;
    const total = pollVotes.reduce((a, b) => a + b, 0);

    pollVotes.forEach((v, i) => {
        const pct = Math.round((v / total) * 100);
        document.getElementById(`poll-pct-${i}`).innerText = pct + '%';
        document.getElementById(`poll-bar-${i}`).style.width = pct + '%';
    });

    document.getElementById('poll-message').classList.remove('hidden');
}