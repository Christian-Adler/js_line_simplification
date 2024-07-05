import {Vector} from "./vector.mjs";
import {scale} from "./utils.mjs";

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

const step = 0.001;

const sequence = [];
for (let x = 0; x <= 5; x += step) {
  const y = -Math.exp(-x) * Math.cos(2 * Math.PI * x);
  sequence.push(new Vector(x, y));
}

const xMin = sequence[0].x;
const xMax = sequence[sequence.length - 1].x;

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

  ctx.beginPath();
  for (let i = 0; i < sequence.length; i++) {
    const vec = sequence[i];
    const x = scale(vec.x, xMin, xMax, 10, worldWidth - 10);
    const y = scale(vec.y, -1, 1, 10, worldHeight - 10);
    if (i === 0)
      ctx.moveTo(x, y);
    else
      ctx.lineTo(x, y);
  }
  ctx.stroke();

  // ctx.restore();


  updateWorldSettings();

  requestAnimationFrame(update);
}

update();