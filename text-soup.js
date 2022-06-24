import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js";
import {
  createVoronoiTessellation,
  random
} from "https://cdn.skypack.dev/@georgedoescode/generative-utils";

/* EDIT HERE */

const chars = 'DVXD Design For Shared Progress';
const numCells = 24;
const fontColor = '#EEE';
const minFontSize = 50;
const maxFontSize = 325;
const maxRotationDegree = 45;
const scale = 0.5; // scale down to add space between
const relaxIterations = 3; // "even out" cell dimensions
const debug = false;

/* END: EDIT HERE */

console.clear();

function generate() {
  document.querySelector(".container").innerHTML = "";
  
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = SVG().viewbox(0, 0, width, height);
  svg.addTo('.container');

  const points = [...Array(numCells)].map(() => {
      return {
         x: random(0, width),
         y: random(0, height)
      };
  });

  const tessellation = createVoronoiTessellation({
    width,
    height,
    points,
    relaxIterations: relaxIterations
  });

  tessellation.cells.forEach((cell) => {
    if (debug) {
      svg.polygon(cell.points).fill("none").stroke("#ccc");
    }

    const char = chars.charAt(Math.floor(Math.random() * 
    chars.length))
    const fontSize = random(minFontSize, maxFontSize, true);

    svg
      .text(char)
      .move(cell.centroid.x,cell.centroid.y)
      .font({fill: fontColor, family: 'Noto Sans', size: fontSize})
      .rotate(random(-maxRotationDegree,maxRotationDegree, true))
      .scale(scale);
  });
}

function init() {
  document.querySelector(".button").addEventListener("click", generate);
  
  generate();
}

init();
