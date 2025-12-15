const TOTAL_TOOTH = 9; //기본 이빨 개수

const $ = id => document.getElementById(id);
const teethRow = $('teeth-row');
const scoreEl = $('score');
const msgEl = $('message');
const jaw = $('jaw');
const easyBtnEl = $('easyBtn');
const normalBtnEl = $('normalBtn');
const hardBtnEl = $('hardBtn');

let badToothIndex = null;
let turns = 9;
let score = 0;
let disabled = false;
let difficulty = 'normal';

//게임 초기화
const init = (difficultyLevel = 'normal') =>{
    const top = jaw.querySelector('.top');
    top.style.transform = 'translateY(-55%)';

    difficulty = difficultyLevel;
    teethRow.innerHTML = '';
    turns = 0;
    score = 0;
    disabled = false;

    scoreEl.textContent = score;

    //난이도 버튼 스타일 변경
    const setActiveButton = (active) => {
        const buttons = {
            easy: easyBtnEl,
            normal: normalBtnEl,
            hard: hardBtnEl
        };

        Object.entries(buttons).forEach(([key, btn])=>{
            const isActive = key === active;
            btn.style.backgroundColor = isActive ? '#2f8f4b' : '#ffffff';
            btn.style.color = isActive ? '#ffffff' : '#2f8f4b';
        });
    }
    switch (difficultyLevel) {
        case "easy":
        case "normal":
        case "hard":
            setActiveButton(difficultyLevel);
            break;
    }

    // 랜덤한 물림 위치 설정
    badToothIndex = Math.floor(Math.random() * TOTAL_TOOTH);

    //이빨 버튼 생성
    for(let i = 0; i < TOTAL_TOOTH; i++){
        const btn = document.createElement('button');
        btn.className = 'tooth';
        btn.textContent = i + 1;
        btn.dataset.index = i;
        btn.addEventListener('click' , onToothClick);
        teethRow.appendChild(btn);
    }
};

 
const onToothClick = e =>{
    if(disabled) return;

    const btn = e.currentTarget;
    const idx =+ btn.dataset.index;
    if(btn.classList.contains('disabled')) return;

    // 난이도 보정(gard: 위험도 증가)
    if(difficulty === 'hard' && Math.random() < 0.18) badToothIndex = idx;

    // 물림 처리
    if(idx === badToothIndex) return onBite(btn);

    // 안전한 경우
    btn.classList.add('disabled');
    scoreEl.textContent = ++score;
    msgEl.textContent = '';

    btn.animate(
        [
            {transform: 'translateY(0)'},
            {transform: 'translateY(-6px)'},
            {transform: 'translateY(0)'},
        ],
        {duration: 220}
    )                                
}

const onBite = btn =>{
    disabled = true;
    msgEl.textContent = '게임 오버!';

    // 악어 턱 닫기
    jaw.querySelector('.top').style.transform = 'translateY(0%)';

    // 이빨 색상 변경
    Object.assign(btn.style, {
        background: 'linear-gradient (180deg, #ffdede, #ffbdbd)',
        borderColor: 'rgba(178, 34, 34,0.6)'
    });
};

// 컨트롤 바인딩
$('restartBtn').addEventListener('click', () =>init(difficulty));
$('easyBtn').addEventListener('click', () =>init('easy'));
$('normalBtn').addEventListener('click', () =>init('normal'));
$('hardBtn').addEventListener('click', () =>init('hard'));

//게임 시작
init('normal');