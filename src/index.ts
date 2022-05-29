import {GameInterface} from './interfaces';

import {Game as ConwaysGame} from './game_conway.js';
import {Game as TestGame} from './game_test.js';
import {Game as AverageGame} from './game_average.js';
import {Game as OrbitalGame} from './game_orbital.js';


window.onload = main;
let currentGame: GameInterface;

function getCanvas(): HTMLCanvasElement | null {
  const canvas = document.querySelector('canvas');

  if (!canvas) {
    throw 'Davai seni';
  }
  return canvas;
}

function getContext(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null {
  const c = canvas.getContext('2d');
  if (!c) {
    console.error('Failed to get canvas context');
    return null;
  }
  return c;
}

function startGame(game: GameInterface): void {
  if (currentGame) {
    currentGame.stop();
  }
  currentGame = game;
  currentGame.start();
}

function addListeners(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): void {
  const game_test = document.getElementById('game_test');
  const game_conway = document.getElementById('game_conway');
  const game_average = document.getElementById('game_average');
  const game_orbital = document.getElementById('game_orbital');

  if (game_test) {
    game_test.addEventListener('click', () => {
      startGame(new TestGame(canvas, context));
    });
  }
  if (game_conway) {
    game_conway.addEventListener('click', () => {
      startGame(new ConwaysGame(canvas, context));
    });
  }
  if (game_average) {
    game_average.addEventListener('click', () => {
      startGame(new AverageGame(canvas, context));
    });
  }
  if (game_orbital) {
    game_orbital.addEventListener('click', () => {
      startGame(new OrbitalGame(canvas, context));
    });
  }
}

function main(): void {
  const canvas = getCanvas();
  if (!canvas) {
    console.error('Failed to get canvas');
    return;
  }
  const context = getContext(canvas);
  if (!context) {
    console.error('Failed to get context');
    return;
  }

  addListeners(canvas, context);
}
