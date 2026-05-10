const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

const rects = [];

function getRandomNumber(from, to){
    return Math.floor(Math.random() * (to - from + 1)) + from;
}
function getRandomColor(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

const rectsToGenerate = 2_000;
const MAX_RECT_SIZE = 15;
const SCALE = 2;

function generateRandomRects(){
    for (let i = 0; i < rectsToGenerate; i++){
        let num =  getRandomNumber(1, MAX_RECT_SIZE);
        const rect = {
            x: 0,
            y: 0,
            width: getRandomNumber(1, MAX_RECT_SIZE),
            height: getRandomNumber(1, MAX_RECT_SIZE),
        }
        rects.push(rect);
    }
}

function G_delayMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function drawResult(rects){
    G_isPlaying = true;
    for (let i = 0; i < rects.length; i++){
        const rect = rects[i];
        if (i % 5 == 0) await G_delayMs(1);

        ctx.fillStyle = getRandomColor().replace('f', '0');
        ctx.fillRect(rect.x * SCALE, rect.y * SCALE, rect.width * SCALE, rect.height * SCALE);
    }
    G_isPlaying = false;
}
function clearCanvas(){
    ctx.fillStyle = '#1d1d1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const rectPacker = new RectPacker();

let lastResult;
window.onload = async () => {
    generateRandomRects();
    const getState = (state) => {
        console.log(state.msg);
        if (state.size){
            canvas.width = state.size * SCALE;
            canvas.height = state.size * SCALE;    
        }
    }
    
    console.time('pack rects');
    const result = await rectPacker.pack(rects, {}, getState);
    console.timeEnd('pack rects');

    lastResult = result;

    canvas.width = result.bestFit * SCALE;
    canvas.height = result.bestFit * SCALE;
}

document.getElementById('play').addEventListener('click', () => {
    play();
})

async function play(){
    clearCanvas();
    await drawResult(lastResult.rects);
}