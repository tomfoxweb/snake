import { ImageProviderService } from '../image-provider.service';
import { Rectangle } from './boundable';
import { DrawableType } from './drawable';
import { Direction, DynamicObject } from './dynamic-object';
import { GameObject } from './game-object';
import { intersect } from './intersect';

export class Game {
  private imageProvider: ImageProviderService;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rows: number;
  private columns: number;
  private snakeHead: DynamicObject;
  private snakeTail: DynamicObject;
  private snakeBody: DynamicObject[];
  private direction: Direction;
  private borders: Rectangle[];
  private isGameFail = false;

  constructor(imageProvider: ImageProviderService, canvas: HTMLCanvasElement) {
    this.imageProvider = imageProvider;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.rows = Math.trunc(this.canvas.height / GameObject.size);
    this.columns = Math.trunc(this.canvas.width / GameObject.size);
    this.borders = this.createBorders();
    const [head, body, tail] = this.createSnakeAtStart();
    this.snakeHead = head;
    this.snakeBody = body;
    this.snakeTail = tail;
    this.direction = Direction.Right;
    this.startGameLoop();
  }

  restart() {
    const [head, body, tail] = this.createSnakeAtStart();
    this.snakeHead = head;
    this.snakeBody = body;
    this.snakeTail = tail;
    this.direction = Direction.Right;
    this.isGameFail = false;
  }

  up() {
    if (this.direction === Direction.Left) {
      this.direction = Direction.Up;
    } else if (this.direction === Direction.Right) {
      this.direction = Direction.Up;
    }
  }

  down() {
    if (this.direction === Direction.Left) {
      this.direction = Direction.Down;
    } else if (this.direction === Direction.Right) {
      this.direction = Direction.Down;
    }
  }

  left() {
    if (this.direction === Direction.Up) {
      this.direction = Direction.Left;
    } else if (this.direction === Direction.Down) {
      this.direction = Direction.Left;
    }
  }

  right() {
    if (this.direction === Direction.Up) {
      this.direction = Direction.Right;
    } else if (this.direction === Direction.Down) {
      this.direction = Direction.Right;
    }
  }

  private startGameLoop() {
    window.setInterval(() => {
      if (this.isGameFail) {
        return;
      }
      this.move();
      this.draw();
    }, 200);
  }

  private move() {
    this.moveTail();
    this.moveBody();
    this.moveHead();
    this.checkForBorderHit();
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
      this.isGameFail = true;
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

  private showGameFail() {
    this.ctx.save();
    this.ctx.font = '36px monospace';
    this.ctx.fillStyle = 'gold';
    const x = this.canvas.width / 2 - 60;
    const y = this.canvas.height / 2 - 20;
    this.ctx.fillText('Fail', x, y);
    this.ctx.restore();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.snakeHead.draw(this.ctx);
    this.snakeBody.forEach((body) => {
      body.draw(this.ctx);
    });
    this.snakeTail.draw(this.ctx);
    if (this.isGameFail) {
      this.showGameFail();
    }
  }

  private createSnakeAtStart(): [
    DynamicObject,
    DynamicObject[],
    DynamicObject
  ] {
    const bodyX = Math.trunc(this.columns / 2);
    const headX = bodyX + 1;
    const tailX = bodyX - 3;
    const snakeY = Math.trunc(this.rows / 2);
    const head = this.createHead(headX, snakeY, Direction.Right);
    const body = [
      this.createBody(bodyX, snakeY, Direction.Right, Direction.Right),
      this.createBody(bodyX - 1, snakeY, Direction.Right, Direction.Right),
      this.createBody(bodyX - 2, snakeY, Direction.Right, Direction.Right),
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
    const top: Rectangle = { x: 0, y: -1000, w: this.canvas.width, h: 1000 };
    const bottom: Rectangle = {
      x: 0,
      y: this.canvas.height,
      w: this.canvas.width,
      h: 1000,
    };
    const left: Rectangle = { x: -1000, y: 0, w: 1000, h: this.canvas.height };
    const right: Rectangle = {
      x: this.canvas.width,
      y: 0,
      w: 1000,
      h: this.canvas.height,
    };
    return [top, right, bottom, left];
  }
}
