import { ImageProviderService } from '../image-provider.service';
import { DrawableType } from './drawable';
import { Direction, DynamicObject } from './dynamic-object';

export class Game {
  private imageProvider: ImageProviderService;

  constructor(imageProvider: ImageProviderService) {
    this.imageProvider = imageProvider;
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
