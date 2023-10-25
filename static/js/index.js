const timer = document.getElementById('timer');
const lines = timer.querySelector('#lines');
const fins = timer.querySelector('#fins');
const nums = timer.querySelector('#num-container');

const control = document.querySelector('.button-container #control');
const reset = document.querySelector('.button-container #reset');

const alarmButton = document.querySelector('.button-container #alarm');
const audioElement = document.querySelector('#EndAlarm');

const remainTime = document.querySelector('.time-container #remain-time');

// const totalTime = document.querySelector('.time-container #total-time');

// const endTime = 60
const endTimeInput = document.getElementById('endTime');
let intervalID = null;
let progressTimeSec = 0;

let isPlay = false;
let endTime = Number(endTimeInput.value);  // Convert string to number
control.innerHTML = `<i class="fas fa-play"></i>`;  // 초기 상태의 버튼을 재생 모양으로 설정
let isAlarmOn = true; // Default is true


// Add an event listener to update endTime when the input changes
endTimeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();  // Prevent form submission

        const inputValue = Number(this.value);
        if (inputValue < 1 || inputValue > 60) {
            alert('1~60 사이의 값을 입력해주세요.');
            return;
        }
        
        pause();  // Pause the current timer
        progressTimeSec = 0;  // Reset progress time
        endTime = inputValue;  // Update endTime with the new input value
        fins.innerHTML = '';  // Clear fins before painting new ones

        paintRemainTime();
        renderRemainTime();
        
        play();   // Start playing after setting up everything
    }
});



// Add an event listener to update endTime when the input changes
endTimeInput.addEventListener('change', function() {
    const inputValue = Number(this.value);
    if (inputValue < 1 || inputValue > 60) {
        alert('1~60 사이의 값을 입력해주세요.');
        return;
    }
    
    pause();  // Pause the current timer
    progressTimeSec = 0;  // Reset progress time
    endTime = inputValue;  // Update endTime with the new input value
    fins.innerHTML = '';  // Clear fins before painting new ones

    paintRemainTime();
    renderRemainTime();
    updateNumberColors();  // 여기서 호출하여 숫자 색상 업데이트

});

// 'alarm' 버튼 클릭 시 이벤트 핸들러
alarmButton.addEventListener('click', function() {
    isAlarmOn = !isAlarmOn;  // 알람 상태 토글
    if (isAlarmOn) {
        alarm.innerHTML = `<i class="fas fa-bell"></i>`;
    } else {
        alarm.innerHTML = `<i class="fas fa-bell-slash"></i>`;
    }
});




function play() {
    const inputValue = Number(endTimeInput.value);

     if (inputValue < 1 || inputValue > 60) {
        alert('1~60 사이의 값을 입력해주세요.');
        return;
     }
    //  intervalID = setInterval(tickSec,(60*100)/Number(endTimeInput.value))
    intervalID = setInterval(tickSec, 100);

    isPlay = true;
    control.innerHTML = `<i class="fas fa-pause"></i>`;
    updateNumberColors();
}

function paintLines() {
    for(let i=0; i<30; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.transform = `rotate(${i*6}deg)`;

        if (i%5 == 0) {
            line.classList.add('thick')
        }

        lines.append(line);
    }
}

function paintNumber() {
    let left = 15;
    let right = 45;

    for (let i=0; i<6; i++) {
        const numBox = document.createElement('div');
        numBox.classList.add('num-box');
        numBox.style.transform = `rotate(${i*30}deg)`;

        const spanLeft = document.createElement('span');
        const spanRight = document.createElement('span');

        const leftText = left - 5*i;
        
        spanLeft.textContent = leftText<=0 ? 60+ leftText : leftText;
        spanRight.textContent = right - (5 * i);

        spanLeft.style.transform = `rotate(${-30*i}deg)`;
        spanRight.style.transform = `rotate(${-30*i}deg)`;

        // spanLeft, spanRight의 색상을 그레이로 설정
        spanLeft.style.color = 'gray';
        spanRight.style.color = 'gray';

        numBox.append(spanLeft,spanRight);
        nums.append(numBox);
    }
}

// spanLeft, spanRight의 색상을 업데이트하는 함수
function updateNumberColors() {
    const numBoxes = document.querySelectorAll('.num-box');
    numBoxes.forEach((numBox, i) => {
        const [spanLeft, spanRight] = numBox.children;
        
        let leftText = 15 - 5 * i;
        if (leftText <= 0) {
            leftText += 60;
        }
        
        const rightText = 45 - (5 * i);
        
        // input 값과 일치하는 것만 검정색으로 표시
        if (leftText === Number(endTimeInput.value) || Number(endTimeInput.value) === 60 && leftText === 60) {
            spanLeft.style.color = 'black';
        } else {
            spanLeft.style.color = 'white';
        }
        
        if (rightText === Number(endTimeInput.value)) {
            spanRight.style.color = 'black';
        } else {
            spanRight.style.color = 'white';
        }
    });
}


function paintRemainTime() {
    // Remove all existing fins before painting new ones
    while (fins.firstChild) {
        fins.removeChild(fins.firstChild);
    }
    // endTime 대신에 Number(endTimeInput.value) 사용하여 파인 생성
    for (let min=0; min<Number(endTimeInput.value); min++) {
        for (let sec=0; sec<60; sec++) {
            const remainFin = document.createElement('div');
            remainFin.classList.add('fin');
            const deg = min*6+sec*0.1;
            remainFin.style.transform = `rotate(${-deg}deg)`

            fins.append(remainFin);
        }
    }
}


function tickSec() {
    progressTimeSec++;
    if(progressTimeSec >= endTime * 60) pause();

    const lastFin = fins.lastChild;
    
    if (lastFin) {
        lastFin.remove();
    };
    renderRemainTime();
}

document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {  // Check if the space bar was pressed
        e.preventDefault();  // Prevent scrolling
        if (isPlay) {
            pause();
        } else {
            play();
        }
    }
});







function pause() {
    clearInterval(intervalID);
    isPlay = false;
    control.innerHTML = `<i class="fas fa-play"></i>`;
}


function onClickControl() {
    if (isPlay) {
        pause();
        
    } else {
        play();
    }
}
function ResetControl() {
        clearInterval(intervalID);  // Stop the timer
        progressTimeSec = 0;  // Reset the elapsed time
        endTime = Number(endTimeInput.value);  // Update the end time with the current input value
        fins.innerHTML = '';  // Clear all fins

        paintRemainTime();  // Paint new fins based on the updated end time
        renderRemainTime();  // Update the displayed remaining time

        isPlay = false; 
        control.innerHTML = `<i class="fas fa-play"></i>`;

    }


function renderRemainTime() {
    const totalSec = endTime * 60 - progressTimeSec;
    const min = Math.floor(totalSec/60);
    const sec = totalSec % 60;

    if (min === 0 && sec === 0) {
        if(isAlarmOn) { // Check the alarm status
            var audio = document.getElementById("EndAlarm");
            audio.play();
        }
    }

    remainTime.textContent = `
        ${min<10?`0${min}`:min} : 
        ${sec<10?`0${sec}`:sec}
    `;
}

function paintTime() {
    renderRemainTime();
    // totalTime.textContent = `(${endTime} : 00)`;
}

if (lines) {
    paintLines();
}

if (nums) {
    paintNumber();
}

if (fins) {
    paintRemainTime();
}

if(control) {
    control.addEventListener('click', onClickControl);
}

if(reset) {
    reset.addEventListener('click', ResetControl);
}

if(remainTime) {
    paintTime();
}

// window.onload = function() {
//     document.getElementById("endTime").focus();
// };

window.addEventListener('keydown', function(e) {
    var key = e.key;
    if (!isNaN(key)) {  // Check if the key pressed is a number
        document.getElementById("endTime").focus();
    }
});


function moveCursorToEnd(input) {
    // Move cursor to the end
    var valueLength = input.value.length;
    input.focus();
    input.setSelectionRange(valueLength, valueLength);
}

function limitInputLength(input, maxLength) {
    if (input.value.length > maxLength) {
        input.value = input.value.slice(-maxLength);
    }
}


``


