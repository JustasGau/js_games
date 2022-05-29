import {GameInterface} from './interfaces';

class StartPoint {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  size = 5;

  constructor(context: CanvasRenderingContext2D, x: number, y: number) {
    this.context = context;
    this.x = x;
    this.y = y - 30;
  }

  draw(): void {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2, false);
    this.context.fillStyle = 'black';
    this.context.fill();
  }
}

class Point {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  size = 20;

  constructor(context: CanvasRenderingContext2D, x: number, y: number) {
    this.context = context;
    this.x = x;
    this.y = y - 30;
  }

  draw(): void {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2, false);
    this.context.fillStyle = 'black';
    this.context.fill();
  }
}

const STAGES = {
  EDGES: 1,
  POINT: 2,
  DRAW: 3,
};

export class Game implements GameInterface {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  points: Point[] = [];
  startPoint!: StartPoint;
  animation!: number;
  currentStage = STAGES.EDGES;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  start(): void {
    this.canvas.addEventListener('click', event => this.drawPoint(event));
    this.canvas.height = innerHeight - 30;
    this.canvas.width = innerWidth;
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    console.log('Average game started');
    addEventListener(
      'keydown',
      event => {
        const name = event.key;
        const code = event.code;
        console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
        if (code === 'Enter') {
          if (this.currentStage === STAGES.DRAW) {
            this.stop();
            return;
          }
          this.currentStage++;
          if (this.currentStage === STAGES.DRAW) {
            this.gameLoop();
          }
        }
      },
      false
    );
  }

  stop(): void {
    window.cancelAnimationFrame(this.animation);
    this.currentStage = STAGES.EDGES;
    this.points = [];
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPoint(event: MouseEvent): void {
    if (this.currentStage === STAGES.EDGES) {
      const point = new Point(this.context, event.clientX, event.clientY);
      this.points.push(point);
      point.draw();
    } else if (this.currentStage === STAGES.POINT) {
      this.startPoint = new StartPoint(
        this.context,
        event.clientX,
        event.clientY
      );
      this.startPoint.draw();
    }
  }
  getRandomInt(minInt: number, maxInt: number): number {
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
  }

  gameLoop(): void {
    const index = this.getRandomInt(0, this.points.length - 1);
    const point = this.points[index];
    const midX = (point.x + this.startPoint.x) / 2;
    const midY = (point.y + this.startPoint.y) / 2;
    this.startPoint = new StartPoint(this.context, midX, midY + 30);
    this.startPoint.draw();
    this.animation = window.requestAnimationFrame(() => this.gameLoop());
  }
}
