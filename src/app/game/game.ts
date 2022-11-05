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

  constructor(imageProvider: ImageProviderService, canvas: HTMLCanvasElement) {
    this.imageProvider = imageProvider;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.rows = Math.trunc(this.canvas.width / GameObject.size);
    this.columns = Math.trunc(this.canvas.height / GameObject.size);
    const [head, body, tail] = this.createSnake();
    this.snakeHead = head;
    this.snakeBody = [body];
    this.snakeTail = tail;
    this.startGameLoop();
  }

  restart() {
    const [head, body, tail] = this.createSnake();
    this.snakeHead = head;
    this.snakeBody = [body];
    this.snakeTail = tail;
  }

  private startGameLoop() {
    this.draw();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.snakeHead.draw(this.ctx);
    this.snakeBody.forEach((body) => {
      body.draw(this.ctx);
    });
    this.snakeTail.draw(this.ctx);
  }

  private createSnake(): [DynamicObject, DynamicObject, DynamicObject] {
    const bodyX = Math.trunc(this.columns / 2);
    const headX = bodyX + 1;
    const tailX = bodyX - 1;
    const snakeY = Math.trunc(this.rows / 2);
    const head = this.createHead(headX, snakeY, Direction.Right);
    const body = this.createBody(
      bodyX,
      snakeY,
      Direction.Right,
      Direction.Right
    );
    const tail = this.createTail(tailX, snakeY, Direction.Right);
    return [head, body, tail];
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
