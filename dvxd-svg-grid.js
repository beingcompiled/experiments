import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.37";

/* */

let gridSize = 125;

/* */

let draw, nCols, nRows, colorSets, palette;

console.clear();

function drawD(x, y, foreground, background) {
    const group = draw.group().addClass("draw-d");
    group.rect(gridSize, gridSize).fill(background).move(x, y);
    group.path(`M0,0 L0,${gridSize} ${gridSize>>1},${gridSize} C${gridSize>>1} ${gridSize} ${gridSize*1.15} ${gridSize>>1} ${gridSize>>1} 0 L${gridSize>>1},0 0,0z`).fill(foreground).move(x, y);
}

function drawV(x, y, foreground, background) {
    const group = draw.group().addClass("draw-v");
    group.rect(gridSize, gridSize).fill(background).move(x, y);
    group.polygon(`0,0 ${gridSize>>1},${gridSize} ${gridSize},0`).fill(foreground).move(x, y);
}

function drawX(x, y, foreground, background) {
    const group = draw.group().addClass("draw-x");
    group.rect(gridSize, gridSize).fill(background).move(x, y);
    group.polygon(`0,0 ${gridSize*0.35},${gridSize>>1}, 0,${gridSize} ${gridSize},${gridSize} ${gridSize*0.65},${gridSize>>1} ${gridSize},0`).fill(foreground).move(x, y);
}

function drawCircle(x, y, foreground, background) {
    const group = draw.group().addClass("draw-circle");
    group.rect(gridSize, gridSize).fill(background).move(x, y);
    group.circle(gridSize).fill(foreground).move(x, y);
    // 30% of the time add inner circle
    if (Math.random() < 0.3) {
        group
        .circle(gridSize / 2)
        .fill(background)
        .move(x + gridSize / 4, y + gridSize / 4);
    }
}

function drawSquare(x, y, foreground, background) {
    const group = draw.group().addClass("draw-square");
    group.rect(gridSize, gridSize).fill(background).move(x, y);
    group.polygon(`0,0 0,${gridSize} ${gridSize},${gridSize} ${gridSize},0 0,0`).fill(foreground).move(x, y);
}

function drawBlank(x, y, foreground, background) {
    const group = draw.group().addClass("draw-blank");
    group.rect(gridSize, gridSize).move(x, y);
    group.polygon(`0,0 0,${gridSize} ${gridSize},${gridSize} ${gridSize},0 0,0`).move(x, y);
}


/*

Generate

*/

function generateGrid() {
    const wWidth = window.innerWidth;
    const wHeight = window.innerHeight;
    nCols = Math.ceil(wWidth / gridSize);
    nRows = Math.ceil(wHeight / gridSize);

    document.querySelector(".container").innerHTML = "";

    drawGrid();
}

async function drawGrid() {
    palette = random(colorSets);

    draw = SVG()
        .addTo(".container")
        .size("100%", "100%")
        .viewbox(`0 0 ${nCols * gridSize} ${nRows * gridSize}`);

    for (let i = 0; i < nCols; i++) {
        for (let j = 0; j < nRows; j++) {
            generateBlock(i, j);
        }
    }

    if (Math.random() > 0.3) {
        generateBigBlock();
    }
}

/*

Utilities

*/

function generateBlock(i, j) {
  const { foreground, background } = getTwoColors(palette);

  const blockStyleOptions = [
    drawD,
    drawV,
    drawX,
    drawSquare,
    drawBlank,
    drawBlank,
    drawBlank,
    drawBlank,
    drawBlank
  ];

  const blockStyle = random(blockStyleOptions);
  const xPos = i * gridSize;
  const yPos = j * gridSize;

  blockStyle(xPos, yPos, foreground, background);
}

function generateBigBlock() {
    const { foreground, background } = getTwoColors(palette);

    const blockStyleOptions = [
        drawD,
        drawV,
        drawX
    ];

    let prevgridSize = gridSize;

    const multiplier = random([2, 3]);

    const xPos = random(0, nRows - multiplier, true) * prevgridSize;
    const yPos = random(0, nCols - multiplier, true) * prevgridSize;
    gridSize = multiplier * gridSize;
  
    const blockStyle = random(blockStyleOptions);
    blockStyle(xPos, yPos, foreground, background);

    gridSize = prevgridSize;
}

function getTwoColors(colors) {
    let colorList = [...colors];
    const colorIndex = random(0, colorList.length - 1, true);
    const background = colorList[colorIndex];
    colorList.splice(colorIndex, 1);
    const foreground = random(colorList);

    return { foreground, background };
}

async function init() {
    colorSets = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json").then((response) => response.json());

    generateGrid();
    document.querySelector(".button").addEventListener("click", generateGrid);
}

init();
