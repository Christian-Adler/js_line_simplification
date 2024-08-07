import {Vector} from "./vector.mjs";
import {scale} from "./utils.mjs";
import {lineSimplification} from "./linesimplification.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let worldWidth = canvas.width;
let worldHeight = canvas.height;
let worldWidth2 = worldWidth / 2;
let worldHeight2 = worldHeight / 2;
let worldUpdated = true;

const updateWorldSettings = () => {
  if (worldHeight !== window.innerHeight || worldWidth !== window.innerWidth) {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    worldWidth2 = worldWidth / 2;
    worldHeight2 = worldHeight / 2;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
    worldUpdated = true;
  }
};

updateWorldSettings();

// calc sequences

let xMin = 0;
let xMax = 5;
let yMin = -1;
let yMax = 1;

let numValues = 5000;
let step = 5 / numValues;

let epsilon = 110;

let showOri = true;
let showSimple = true;

let fillFnc = () => {
};

const sequence = [];

const dataFnc = {
  Exp: (x) => -Math.exp(-x) * Math.cos(2 * Math.PI * x),
  Cos: (x) => -(Math.cos(2 * Math.PI * x * 2) + Math.sin(Math.PI * x)),
  Sin: (x) => -Math.sin(954 * x) - 2 * Math.cos(x),
  Cut: (x) => Math.exp(-x) * Math.min(Math.sin(2 * Math.PI * x), 0.3),
  ATan: (x) => -(Math.sin(Math.PI * x / 5) - Math.atan(x * 2)),
  Steps: (x) => ((x - 0.2) * Math.sin(1 / (x - 0.2)) + x + 0.8) * (10 * (x - 0.1) ^ 2 + 0.9),
  SinPow: (x) => Math.sin(x ** x) / Math.pow(2, (x ** x - Math.PI / 2) / Math.PI),
  Rect: (x) => Math.sin(2 * Math.sin(2 * Math.sin(2 * Math.sin(x * 5)))),
  Random: () => -Math.random(),
};

const fill = () => {
  step = 5 / numValues;
  yMax = Number.MIN_SAFE_INTEGER;
  yMin = Number.MAX_SAFE_INTEGER;
  sequence.splice(0, sequence.length);

  for (let x = 0; x <= 5; x += step) {
    const y = fillFnc(x);
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
    sequence.push(new Vector(x, y));
  }

  xMin = sequence[0].x;
  xMax = sequence[sequence.length - 1].x;
};

fillFnc = dataFnc['Exp'];
fill();

const drawSeq = (ctx, seq) => {
  ctx.beginPath();
  for (let i = 0; i < seq.length; i++) {
    const vec = seq[i];
    const x = scale(vec.x, xMin, xMax, 10, worldWidth - 10);
    const y = scale(vec.y, yMin, yMax, 10, worldHeight - 10);
    if (i === 0)
      ctx.moveTo(x, y);
    else
      ctx.lineTo(x, y);
  }
  ctx.stroke();
}

const originalLineDiv = document.getElementById("originalLine");
const reducedLineDiv = document.getElementById("reducedLine");

const update = () => {

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);


  // ctx.save();
  // ctx.translate(10, 0);

  if (showOri)
    drawSeq(ctx, sequence);
  originalLineDiv.innerText = 'original: ' + sequence.length;

  ctx.strokeStyle = "red";
  const simplerSequence = lineSimplification(sequence, epsilon / 1000);
  if (showSimple)
    drawSeq(ctx, simplerSequence);
  reducedLineDiv.innerText = 'simple: ' + simplerSequence.length;

  // ctx.restore();


  updateWorldSettings();

  requestAnimationFrame(update);
}

update();

document.getElementById('inputEpsilon').addEventListener("input", (evt) => {
  const target = evt.target;
  epsilon = Math.pow(parseFloat(target.value), 1.2);
  target.nextSibling.innerText = epsilon.toFixed(1);
});
document.getElementById('inputNumValues').addEventListener("input", (evt) => {
  const target = evt.target;
  numValues = Math.floor(Math.pow(parseInt(target.value), 2.2));
  target.nextSibling.innerText = numValues;
  fill();
});
document.getElementById('checkShowOriginal').addEventListener("change", (evt) => {
  showOri = evt.target.checked;
});
document.getElementById('checkShowSimple').addEventListener("change", (evt) => {
  showSimple = evt.target.checked;
});
const selectDataFncInput = document.getElementById('selectDataFnc');
for (const key of Object.keys(dataFnc)) {
  const optionElement = document.createElement('option');
  // <option value="Exp">Exp</option>
  optionElement.setAttribute('value', key);
  optionElement.innerText = key;
  selectDataFncInput.appendChild(optionElement);
}
selectDataFncInput.addEventListener("change", (evt) => {
  const target = evt.target;
  fillFnc = dataFnc[target.value];
  fill();
});