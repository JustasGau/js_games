import {GameInterface, Drawable} from './interfaces';

class Planet implements Drawable {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  color: string;

  constructor(context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw(): void {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color;
    this.context.fill();
  }
}

export class Game implements GameInterface {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  animation!: number;
  objects: Planet[] = [];

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  start(): void {
    console.log('Orbital simulation started');
    this.canvas.height = innerHeight;
    this.canvas.width = innerWidth;
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const sun = new Planet(this.context, innerWidth/2, innerHeight/2, 40, 'yellow');
    const planet = new Planet(this.context, innerWidth/2, innerHeight/2 - 50, 20, 'green');

    this.objects.push(sun);
    this.objects.push(planet);

    this.gameLoop();
  }

  stop(): void {
    window.cancelAnimationFrame(this.animation);
  }

  gameLoop(): void {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for(let i = 0; i < this.objects.length; i++) {
        const planet = this.objects[i];
        planet.draw();
    }
    this.animation = window.requestAnimationFrame(() => this.gameLoop());
  }
}
