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

  move() {
    switch (this.direction) {
      case Direction.Up:
        this.setY(this.getY() - 1);
        break;
      case Direction.Down:
        this.setY(this.getY() + 1);
        break;
      case Direction.Left:
        this.setX(this.getX() - 1);
        break;
      case Direction.Right:
        this.setX(this.getX() + 1);
        break;
    }
  }
}
