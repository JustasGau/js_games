import {GameInterface} from './interfaces';

const BACKGROUND_COLOR = '#283F3B';
const GLOW = false;
const CELL_SIZE = 10;

class Cell {
  context: CanvasRenderingContext2D;
  size: number;
  color: string;
  alive: boolean;
  x: number;
  y: number;
  futureAlive = false;

  constructor(
    context: CanvasRenderingContext2D,
    size: number,
    aliveColor: string,
    x: number,
    y: number
  ) {
    this.context = context;
    this.size = size;
    this.color = aliveColor;
    this.x = x;
    this.y = y;
    this.alive = Math.random() > 0.7;
  }

  draw(): void {
    this.context.beginPath();
    this.context.arc(
      this.x * this.size + this.size / 2,
      this.y * this.size + this.size / 2,
      this.size / 2,
      0,
      Math.PI * 2,
      false
    );
    this.context.fillStyle = this.alive ? this.color : BACKGROUND_COLOR;
    if (GLOW) {
      this.context.shadowBlur = 5;
      this.context.shadowColor = 'white';
    }

    this.context.fill();
    // this.context.fillRect(
    //   this.x * this.size,
    //   this.y * this.size,
    //   this.size,
    //   this.size
    // );
  }
}

export class Game implements GameInterface {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  cells: Cell[] = [];
  rows!: number;
  columns!: number;
  animation!: number;
  cellSize!: number;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  start(): void {
    this.canvas.addEventListener('click', event => this.checkMouse(event));
    this.canvas.height = innerHeight - 30;
    this.canvas.width = innerWidth;
    this.context.fillStyle = '#283F3B';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    console.log('Conways game started');
    this.gameLoop();
    this.cellSize = CELL_SIZE;
    this.rows = Math.round(this.canvas.height / this.cellSize);
    this.columns = Math.round(this.canvas.width / this.cellSize);
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const newCell = new Cell(this.context, this.cellSize, '#99DDC8', x, y);
        this.cells.push(newCell);
      }
    }
  }

  stop(): void {
    window.cancelAnimationFrame(this.animation);
    this.cells = [];
  }

  checkCells(): void {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        const numAlive: number =
          this.isAlive(x - 1, y - 1) +
          this.isAlive(x, y - 1) +
          this.isAlive(x + 1, y - 1) +
          this.isAlive(x - 1, y) +
          this.isAlive(x + 1, y) +
          this.isAlive(x - 1, y + 1) +
          this.isAlive(x, y + 1) +
          this.isAlive(x + 1, y + 1);
        const centerIndex = this.gridToIndex(x, y);
        if (numAlive === 2) {
          // Do nothing
          this.cells[centerIndex].futureAlive = this.cells[centerIndex].alive;
        } else if (numAlive === 3) {
          // Make alive
          this.cells[centerIndex].futureAlive = true;
        } else {
          // Make dead
          this.cells[centerIndex].futureAlive = false;
        }
      }
    }
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].alive = this.cells[i].futureAlive;
    }
  }
  isAlive(x: number, y: number): number {
    // checks edges
    if (x < 0 || x >= this.columns || y < 0 || y >= this.rows) {
      return 0;
    }
    return this.cells[this.gridToIndex(x, y)].alive ? 1 : 0;
  }

  gridToIndex(x: number, y: number): number {
    return x + y * this.columns;
  }

  mouseToIndex(x: number, y: number): number {
    const rect = this.canvas.getBoundingClientRect();
    const trueX = Math.floor((x - rect.left) / this.cellSize);
    const trueY = Math.floor((y - rect.top) / this.cellSize);
    return trueX + trueY * this.columns;
  }

  checkMouse(event: MouseEvent): void {
    const index = this.mouseToIndex(event.clientX, event.clientY);
    this.cells[index].alive = true;
    this.cells[index].futureAlive = true;
    this.cells[index].draw();
  }

  gameLoop(): void {
    this.checkCells();

    this.context.fillStyle = BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      if (cell.alive) {
        cell.draw();
      }
    }
    setTimeout(() => {
      this.animation = window.requestAnimationFrame(() => this.gameLoop());
    }, 100); // The delay will make the game easier to follow
  }
}
