// interface DrawableObject {
//   x: number;
//   y: number;
//   c: CanvasRenderingContext2D;
//   draw(): void;
// }

// interface VelocityInterface {
//   x: number;
//   y: number;
// }

// class Player implements DrawableObject {
//   x: number;
//   y: number;
//   radius: number;
//   color: string;
//   c: CanvasRenderingContext2D;

//   constructor(
//     context: CanvasRenderingContext2D,
//     x: number,
//     y: number,
//     radius: number,
//     color: string
//   ) {
//     this.c = context;
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.color = color;
//   }

//   draw() {
//     this.c.beginPath();
//     this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     this.c.fillStyle = this.color;
//     this.c.fill();
//   }
// }

// class Projectile implements DrawableObject {
//   x: number;
//   y: number;
//   radius: number;
//   color: string;
//   c: CanvasRenderingContext2D;
//   velocity: VelocityInterface;

//   constructor(
//     context: CanvasRenderingContext2D,
//     x: number,
//     y: number,
//     radius: number,
//     color: string,
//     velocity: VelocityInterface
//   ) {
//     this.c = context;
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.color = color;
//     this.velocity = velocity;
//   }

//   draw() {
//     this.c.beginPath();
//     this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     this.c.fillStyle = this.color;
//     this.c.fill();
//   }

//   update() {
//     this.draw();
//     this.x = this.x + this.velocity.x;
//     this.y = this.y + this.velocity.y;
//   }
// }

// class Enemy implements DrawableObject {
//   x: number;
//   y: number;
//   radius: number;
//   color: string;
//   c: CanvasRenderingContext2D;
//   velocity: VelocityInterface;

//   constructor(
//     context: CanvasRenderingContext2D,
//     x: number,
//     y: number,
//     radius: number,
//     color: string,
//     velocity: VelocityInterface
//   ) {
//     this.c = context;
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.color = color;
//     this.velocity = velocity;
//   }

//   draw() {
//     this.c.beginPath();
//     this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     this.c.fillStyle = this.color;
//     this.c.fill();
//   }

//   update() {
//     this.draw();
//     this.x = this.x + this.velocity.x;
//     this.y = this.y + this.velocity.y;
//   }
// }

// window.onload = main;
// let oldTimeStamp: number;

// const projectiles: Projectile[] = [];
// const enemies: Enemy[] = [];

// let animationdID: number;

// function gameLoop(
//   player: Player,
//   c: CanvasRenderingContext2D,
//   canvas: HTMLCanvasElement,
//   timeStamp: number
// ) {
//   animationdID = requestAnimationFrame(timeStamp => {
//     gameLoop(player, c, canvas, timeStamp);
//   });
//   const secondsPassed = (timeStamp - oldTimeStamp) / 1000;
//   oldTimeStamp = timeStamp;
//   const fps = Math.round(1 / secondsPassed);
//   c.fillStyle = 'white';
//   c.fillRect(0, 0, 200, 100);
//   c.font = '25px Arial';
//   c.fillStyle = 'black';
//   c.fillText('FPS: ' + fps, 10, 30);

//   c.fillStyle = 'rgb(0, 0, 0, 0.1)';
//   c.fillRect(0, 0, canvas.width, canvas.height);
//   player.draw();
//   projectiles.forEach((projectile, pIndex) => {
//     projectile.update();
//     if (
//       projectile.x + projectile.radius < 0 ||
//       projectile.x - projectile.radius > canvas.width ||
//       projectile.y + projectile.radius < 0 ||
//       projectile.y - projectile.radius > canvas.height
//     ) {
//       setTimeout(() => {
//         projectiles.splice(pIndex, 1);
//       }, 0);
//     }
//   });
//   enemies.forEach((en, index) => {
//     en.update();
//     const pDist = Math.hypot(player.x - en.x, player.y - en.y);
//     if (pDist - en.radius - player.radius < 1) {
//       cancelAnimationFrame(animationdID);
//     }
//     projectiles.forEach((projectile, pIndex) => {
//       const dist = Math.hypot(projectile.x - en.x, projectile.y - en.y);
//       if (dist - en.radius - projectile.radius < 1) {
//         if (en.radius - 10 > 10) {
//           en.radius -= 10;
//           setTimeout(() => {
//             projectiles.splice(pIndex, 1);
//           }, 0);
//         } else {
//           setTimeout(() => {
//             enemies.splice(index, 1);
//             projectiles.splice(pIndex, 1);
//           }, 0);
//         }
//       }
//     });
//   });
// }

// function spawnEnemies(c: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
//   setInterval(() => {
//     const radius = Math.random() * (30 - 4) + 4;
//     let x: number;
//     let y: number;
//     if (Math.random() < 0.5) {
//       x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
//       y = Math.random() * canvas.height;
//     } else {
//       x = Math.random() * canvas.height;
//       y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
//     }
//     const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
//     const velocity = {
//       x: Math.cos(angle),
//       y: Math.sin(angle),
//     };
//     const enemyColor = `hsl(${Math.random() * 360}, 50%, 50%)`;
//     const enemy = new Enemy(c, x, y, radius, enemyColor, velocity);
//     enemies.push(enemy);
//   }, 1000);
// }

// function main(): void {
//   const canvas = getCanvas();
//   if (!canvas) {
//     return;
//   }

//   const c = getContext(canvas);
//   if (!c) {
//     return;
//   }

//   const centerX = canvas.width / 2;
//   const centerY = canvas.height / 2;

//   const player = new Player(c, centerX, centerY, 30, 'blue');

//   addEventListener('click', event => {
//     const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
//     const velocity = {
//       x: Math.cos(angle) * 4,
//       y: Math.sin(angle) * 4,
//     };
//     const projectile = new Projectile(c, centerX, centerY, 5, 'red', velocity);
//     projectiles.push(projectile);
//   });
//   gameLoop(player, c, canvas, 0);
//   spawnEnemies(c, canvas);
// }
import {GameInterface} from './interfaces';

export class Game implements GameInterface {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }
  start() {
    console.log('Test game started');
  }

  stop() {
    console.log('Test game stopped');
  }

  gameLoop(): void {
    console.log('gameLoop started');
  }
}
