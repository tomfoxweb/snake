import { ImageProviderService } from '../image-provider.service';
import { DrawableType } from './drawable';
import { Direction, DynamicObject } from './dynamic-object';
import { GameObject } from './game-object';

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

  constructor(imageProvider: ImageProviderService, canvas: HTMLCanvasElement) {
    this.imageProvider = imageProvider;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.rows = Math.trunc(this.canvas.width / GameObject.size);
    this.columns = Math.trunc(this.canvas.height / GameObject.size);
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
      this.move();
      this.draw();
    }, 200);
  }

  private move() {
    this.createNewSnake();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.snakeHead.draw(this.ctx);
    this.snakeBody.forEach((body) => {
      body.draw(this.ctx);
    });
    this.snakeTail.draw(this.ctx);
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

  private createNewSnake() {
    const newHead = this.createNewHead();
    const newBody = this.createNewBody();
    const newTail = this.createNewTail();
    this.snakeHead = newHead;
    this.snakeBody = newBody;
    this.snakeTail = newTail;
  }

  private createNewHead() {
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
    return this.createHead(x, y, this.direction);
  }

  private createNewTail() {
    const prevElement = this.snakeBody[this.snakeBody.length - 1];
    const x = prevElement.getX();
    const y = prevElement.getY();
    const direction = prevElement.getDirection();
    return this.createTail(x, y, direction);
  }

  private createNewBody() {
    let prevDirection = this.snakeHead.getDirection();
    let nextDirection = this.direction;
    let nextX = this.snakeHead.getX();
    let nextY = this.snakeHead.getY();
    const newBody: DynamicObject[] = [];
    newBody.push(this.createBody(nextX, nextY, prevDirection, nextDirection));

    for (let i = 1; i < this.snakeBody.length; i++) {
      nextX = this.snakeBody[i - 1].getX();
      nextY = this.snakeBody[i - 1].getY();
      prevDirection = this.snakeBody[i].getDirection();
      nextDirection = this.snakeBody[i - 1].getDirection();
      newBody.push(this.createBody(nextX, nextY, prevDirection, nextDirection));
    }
    return newBody;
  }

  private createHead(x: number, y: number, direction: Direction) {
    let image: HTMLImageElement;
    switch (direction) {
      case Direction.Up:
        image = this.imageProvider.getImage(DrawableType.HeadUp);
        break;
      case Direction.Down:
        image = this.imageProvider.getImage(DrawableType.HeadDown);
        break;
      case Direction.Left:
        image = this.imageProvider.getImage(DrawableType.HeadLeft);
        break;
      case Direction.Right:
        image = this.imageProvider.getImage(DrawableType.HeadRight);
        break;
    }
    return new DynamicObject(x, y, image, direction);
  }

  private createTail(x: number, y: number, direction: Direction) {
    let image: HTMLImageElement;
    switch (direction) {
      case Direction.Up:
        image = this.imageProvider.getImage(DrawableType.TailUp);
        break;
      case Direction.Down:
        image = this.imageProvider.getImage(DrawableType.TailDown);
        break;
      case Direction.Left:
        image = this.imageProvider.getImage(DrawableType.TailLeft);
        break;
      case Direction.Right:
        image = this.imageProvider.getImage(DrawableType.TailRight);
        break;
    }
    return new DynamicObject(x, y, image, direction);
  }

  private createBody(x: number, y: number, prevDir: Direction, dir: Direction) {
    let image: HTMLImageElement;
    switch (prevDir) {
      case Direction.Up:
        image = this.getBodyImagePrevDirectionUp(dir);
        break;
      case Direction.Down:
        image = this.getBodyImagePrevDirectionDown(dir);
        break;
      case Direction.Left:
        image = this.getBodyImagePrevDirectionLeft(dir);
        break;
      case Direction.Right:
        image = this.getBodyImagePrevDirectionRight(dir);
        break;
    }
    return new DynamicObject(x, y, image, dir);
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
}
