import { GameObject } from './game-object';

export const enum Direction {
  Up,
  Down,
  Right,
  Left,
}

export type Step = -1 | 0 | 1;

export class DynamicObject extends GameObject {
  private direction: Direction;

  constructor(
    x: number,
    y: number,
    image: HTMLImageElement,
    direction: Direction
  ) {
    super(x, y, image);
    this.direction = direction;
  }

  setDirection(direction: Direction) {
    this.direction = direction;
  }

  getDirection() {
    return this.direction;
  }

  move(sx: Step, sy: Step) {
    this.x += sx * this.size;
    this.y += sy * this.size;
  }
}
