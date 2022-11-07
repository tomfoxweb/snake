import { AppComponent } from '../app.component';
import { ImageProviderService } from '../image-provider.service';
import { Rectangle } from './boundable';
import { DrawableType } from './drawable';
import { Direction, DynamicObject } from './dynamic-object';
import { GameObject } from './game-object';
import { intersect } from './intersect';

export class Game {
  private imageProvider: ImageProviderService;
  private canvas: HTMLCanvasElement;
  private app: AppComponent;
  private ctx: CanvasRenderingContext2D;
  private rows: number;
  private columns: number;
  private snakeHead: DynamicObject;
  private snakeTail: DynamicObject;
  private snakeBody: DynamicObject[];
  private apples: GameObject[];
  private direction: Direction;
  private borders: Rectangle[];
  private isGameOver = false;
  private isPaused = false;
  private prevDirectionHandled = true;
  private score: number;

  constructor(
    imageProvider: ImageProviderService,
    canvas: HTMLCanvasElement,
    app: AppComponent
  ) {
    this.imageProvider = imageProvider;
    this.canvas = canvas;
    this.app = app;
    this.ctx = this.canvas.getContext('2d')!;
    this.rows = Math.trunc(this.canvas.height / GameObject.size);
    this.columns = Math.trunc(this.canvas.width / GameObject.size);
    this.borders = this.createBorders();
    const [head, body, tail] = this.createSnakeAtStart();
    this.snakeHead = head;
    this.snakeBody = body;
    this.snakeTail = tail;
    this.direction = Direction.Right;
    this.apples = [this.createApple()];
    this.score = 0;
    this.app.showScore(this.score);
    this.startGameLoop();
  }

  restart() {
    const [head, body, tail] = this.createSnakeAtStart();
    this.snakeHead = head;
    this.snakeBody = body;
    this.snakeTail = tail;
    this.direction = Direction.Right;
    this.isGameOver = false;
    this.isPaused = false;
    this.prevDirectionHandled = true;
    this.score = 0;
    this.app.showScore(this.score);
    this.apples = [this.createApple()];
  }

  pause() {
    this.isPaused = true;
    this.prevDirectionHandled = true;
  }

  resume() {
    this.isPaused = false;
    this.prevDirectionHandled = true;
  }

  up() {
    if (this.isGameOver || this.isPaused) {
      return;
    }
    if (!this.prevDirectionHandled) {
      return;
    }
    if (this.direction === Direction.Left) {
      this.direction = Direction.Up;
    } else if (this.direction === Direction.Right) {
      this.direction = Direction.Up;
    }
    this.prevDirectionHandled = false;
  }

  down() {
    if (this.isGameOver || this.isPaused) {
      return;
    }
    if (!this.prevDirectionHandled) {
      return;
    }
    if (this.direction === Direction.Left) {
      this.direction = Direction.Down;
    } else if (this.direction === Direction.Right) {
      this.direction = Direction.Down;
    }
    this.prevDirectionHandled = false;
  }

  left() {
    if (this.isGameOver || this.isPaused) {
      return;
    }
    if (!this.prevDirectionHandled) {
      return;
    }
    if (this.direction === Direction.Up) {
      this.direction = Direction.Left;
    } else if (this.direction === Direction.Down) {
      this.direction = Direction.Left;
    }
    this.prevDirectionHandled = false;
  }

  right() {
    if (this.isGameOver || this.isPaused) {
      return;
    }
    if (!this.prevDirectionHandled) {
      return;
    }
    if (this.direction === Direction.Up) {
      this.direction = Direction.Right;
    } else if (this.direction === Direction.Down) {
      this.direction = Direction.Right;
    }
    this.prevDirectionHandled = false;
  }

  private startGameLoop() {
    window.setInterval(() => {
      if (this.isGameOver || this.isPaused) {
        return;
      }
      this.move();
      this.draw();
      this.prevDirectionHandled = true;
    }, 500);
  }

  private move() {
    this.moveTail();
    this.moveBody();
    this.moveHead();
    this.checkForBorderHit();
    this.checkForBodyHit();
    this.checkForAppleHit();
  }

  private moveTail() {
    const lastBodyElement = this.snakeBody[this.snakeBody.length - 1];
    const direction = lastBodyElement.getDirection();
    const x = lastBodyElement.getX();
    const y = lastBodyElement.getY();
    const image = this.getTailImage(direction);
    this.snakeTail.setDirection(direction);
    this.snakeTail.setX(x);
    this.snakeTail.setY(y);
    this.snakeTail.setImage(image);
  }

  private moveHead() {
    let x = this.snakeHead.getX();
    let y = this.snakeHead.getY();
    switch (this.direction) {
      case Direction.Up:
        y--;
        break;
      case Direction.Down:
        y++;
        break;
      case Direction.Left:
        x--;
        break;
      case Direction.Right:
        x++;
        break;
    }
    const image = this.getHeadImage(this.direction);
    this.snakeHead.setX(x);
    this.snakeHead.setY(y);
    this.snakeHead.setDirection(this.direction);
    this.snakeHead.setImage(image);
  }

  private moveBody() {
    for (let i = this.snakeBody.length - 1; i > 0; i--) {
      const curr = this.snakeBody[i];
      const next = this.snakeBody[i - 1];
      curr.setX(next.getX());
      curr.setY(next.getY());
      const image = this.getBodyImage(curr.getDirection(), next.getDirection());
      curr.setImage(image);
      curr.setDirection(next.getDirection());
    }
    const first = this.snakeBody[0];
    first.setX(this.snakeHead.getX());
    first.setY(this.snakeHead.getY());
    const image = this.getBodyImage(first.getDirection(), this.direction);
    first.setImage(image);
    first.setDirection(this.direction);
  }

  private checkForBorderHit() {
    if (this.isBorderHit()) {
      this.isGameOver = true;
    }
  }

  private isBorderHit(): boolean {
    for (const border of this.borders) {
      if (intersect(this.snakeHead.getBounds(), border)) {
        return true;
      }
    }
    return false;
  }

  private checkForBodyHit() {
    if (this.isBodyHit()) {
      this.isGameOver = true;
    }
  }

  private isBodyHit(): boolean {
    const headBounds = this.snakeHead.getBounds();
    for (let i = 0; i < this.snakeBody.length; i++) {
      if (intersect(headBounds, this.snakeBody[i].getBounds())) {
        return true;
      }
    }
    if (intersect(headBounds, this.snakeTail.getBounds())) {
      return true;
    }
    return false;
  }

  private checkForAppleHit() {
    for (const [index, apple] of this.apples.entries()) {
      if (intersect(apple.getBounds(), this.snakeHead.getBounds())) {
        this.apples.splice(index, 1);
        this.growSnake();
        this.score++;
        this.app.showScore(this.score);
        this.apples.push(this.createApple());
        return;
      }
    }
  }

  private growSnake() {
    const prevTailX = this.snakeTail.getX();
    const prevTailY = this.snakeTail.getY();
    const tailDirection = this.snakeTail.getDirection();
    const image = this.getBodyImage(tailDirection, tailDirection);
    this.snakeBody.push(
      new DynamicObject(prevTailX, prevTailY, image, tailDirection)
    );
    let newTailX = prevTailX;
    let newTailY = prevTailY;
    switch (tailDirection) {
      case Direction.Up:
        newTailY++;
        break;
      case Direction.Down:
        newTailY--;
        break;
      case Direction.Left:
        newTailX++;
        break;
      case Direction.Right:
        newTailX--;
        break;
    }
    this.snakeTail.setX(newTailX);
    this.snakeTail.setY(newTailY);
  }

  private showGameOverMessage() {
    this.ctx.save();
    this.ctx.font = '36px monospace';
    this.ctx.fillStyle = 'brown';
    const x = this.canvas.width / 2 - 100;
    const y = this.canvas.height / 2 - 20;
    this.ctx.fillText('Game Over!', x, y);
    this.ctx.restore();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.snakeHead.draw(this.ctx);
    this.snakeBody.forEach((body) => {
      body.draw(this.ctx);
    });
    this.snakeTail.draw(this.ctx);
    this.apples.forEach((x) => {
      x.draw(this.ctx);
    });
    if (this.isGameOver) {
      this.showGameOverMessage();
    }
  }

  private createSnakeAtStart(): [
    DynamicObject,
    DynamicObject[],
    DynamicObject
  ] {
    const bodyX = Math.trunc(this.columns / 2);
    const headX = bodyX + 1;
    const tailX = bodyX - 1;
    const snakeY = Math.trunc(this.rows / 2);
    const head = this.createHead(headX, snakeY, Direction.Right);
    const body = [
      this.createBody(bodyX, snakeY, Direction.Right, Direction.Right),
    ];
    const tail = this.createTail(tailX, snakeY, Direction.Right);
    return [head, body, tail];
  }

  private createHead(x: number, y: number, direction: Direction) {
    const image = this.getHeadImage(direction);
    return new DynamicObject(x, y, image, direction);
  }

  private getHeadImage(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        return this.imageProvider.getImage(DrawableType.HeadUp);
      case Direction.Down:
        return this.imageProvider.getImage(DrawableType.HeadDown);
      case Direction.Left:
        return this.imageProvider.getImage(DrawableType.HeadLeft);
      case Direction.Right:
        return this.imageProvider.getImage(DrawableType.HeadRight);
    }
  }

  private createTail(x: number, y: number, direction: Direction) {
    const image = this.getTailImage(direction);
    return new DynamicObject(x, y, image, direction);
  }

  private getTailImage(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        return this.imageProvider.getImage(DrawableType.TailUp);
      case Direction.Down:
        return this.imageProvider.getImage(DrawableType.TailDown);
      case Direction.Left:
        return this.imageProvider.getImage(DrawableType.TailLeft);
      case Direction.Right:
        return this.imageProvider.getImage(DrawableType.TailRight);
    }
  }

  private createBody(x: number, y: number, prevDir: Direction, dir: Direction) {
    const image = this.getBodyImage(prevDir, dir);
    return new DynamicObject(x, y, image, dir);
  }

  private getBodyImage(prevDirection: Direction, direction: Direction) {
    switch (prevDirection) {
      case Direction.Up:
        return this.getBodyImagePrevDirectionUp(direction);
      case Direction.Down:
        return this.getBodyImagePrevDirectionDown(direction);
      case Direction.Left:
        return this.getBodyImagePrevDirectionLeft(direction);
      case Direction.Right:
        return this.getBodyImagePrevDirectionRight(direction);
    }
  }

  private getBodyImagePrevDirectionUp(direction: Direction) {
    switch (direction) {
      case Direction.Up:
      case Direction.Down:
        return this.imageProvider.getImage(DrawableType.BodyVertical);
      case Direction.Left:
        return this.imageProvider.getImage(DrawableType.BodyAngle45);
      case Direction.Right:
        return this.imageProvider.getImage(DrawableType.BodyAngle135);
    }
  }

  private getBodyImagePrevDirectionDown(direction: Direction) {
    switch (direction) {
      case Direction.Up:
      case Direction.Down:
        return this.imageProvider.getImage(DrawableType.BodyVertical);
      case Direction.Left:
        return this.imageProvider.getImage(DrawableType.BodyAngle315);
      case Direction.Right:
        return this.imageProvider.getImage(DrawableType.BodyAngle225);
    }
  }

  private getBodyImagePrevDirectionLeft(direction: Direction) {
    switch (direction) {
      case Direction.Left:
      case Direction.Right:
        return this.imageProvider.getImage(DrawableType.BodyHorizontal);
      case Direction.Up:
        return this.imageProvider.getImage(DrawableType.BodyAngle225);
      case Direction.Down:
        return this.imageProvider.getImage(DrawableType.BodyAngle135);
    }
  }

  private getBodyImagePrevDirectionRight(direction: Direction) {
    switch (direction) {
      case Direction.Left:
      case Direction.Right:
        return this.imageProvider.getImage(DrawableType.BodyHorizontal);
      case Direction.Up:
        return this.imageProvider.getImage(DrawableType.BodyAngle315);
      case Direction.Down:
        return this.imageProvider.getImage(DrawableType.BodyAngle45);
    }
  }

  private createBorders(): Rectangle[] {
    const top: Rectangle = { x: 0, y: -1000, w: this.canvas.width, h: 990 };
    const bottom: Rectangle = {
      x: 0,
      y: this.canvas.height,
      w: this.canvas.width,
      h: 990,
    };
    const left: Rectangle = { x: -1000, y: 0, w: 990, h: this.canvas.height };
    const right: Rectangle = {
      x: this.canvas.width,
      y: 0,
      w: 990,
      h: this.canvas.height,
    };
    return [top, right, bottom, left];
  }

  private createApple(): GameObject {
    const freeCells = this.findFreeCells();
    const randIndex = Math.trunc(Math.random() * freeCells.length);
    const [appleY, appleX] = freeCells[randIndex];
    const image = this.imageProvider.getImage(DrawableType.Apple);
    const apple = new GameObject(appleX, appleY, image);
    return apple;
  }

  private findFreeCells() {
    const freeCells: [number, number][] = [];
    for (let row = 2; row < this.rows - 2; row++) {
      for (let col = 2; col < this.columns - 2; col++) {
        freeCells.push([row, col]);
      }
    }
    const headX = this.snakeHead.getX();
    const headY = this.snakeHead.getY();
    const headIndex = freeCells.findIndex((x) => {
      x[0] === headY && x[1] === headX;
    });
    if (headIndex >= 0) {
      freeCells.splice(headIndex, 1);
    }

    this.snakeBody.forEach((body) => {
      const bodyX = body.getX();
      const bodyY = body.getY();
      const bodyIndex = freeCells.findIndex((x) => {
        x[0] === bodyY && x[1] === bodyX;
      });
      if (bodyIndex > 0) {
        freeCells.splice(bodyIndex, 1);
      }
    });

    const tailX = this.snakeTail.getX();
    const tailY = this.snakeTail.getY();
    const tailIndex = freeCells.findIndex((x) => {
      x[0] === tailX && x[1] === tailY;
    });
    if (tailIndex >= 0) {
      freeCells.splice(tailIndex, 1);
    }
    return freeCells;
  }
}
