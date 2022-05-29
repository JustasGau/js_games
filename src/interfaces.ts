export interface GameInterface {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  start(): void;
  stop(): void;
  gameLoop(): void;
}

export interface Drawable {
  draw(): void
}
