import { Injectable } from '@angular/core';
import { DrawableType } from './game/drawable';

interface SnakeElement {
  type: DrawableType;
  row: number;
  col: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageProviderService {
  private images: Map<DrawableType, HTMLImageElement>;
  private elements: SnakeElement[];
  private readonly snakeSpriteUrl = 'assets/images/snake.png';
  private readonly snakeElementSize = 64;

  constructor() {
    this.images = new Map([]);
    this.elements = [
      { type: DrawableType.HeadUp, row: 0, col: 3 },
      { type: DrawableType.HeadRight, row: 0, col: 4 },
      { type: DrawableType.HeadDown, row: 1, col: 4 },
      { type: DrawableType.HeadLeft, row: 1, col: 3 },
      { type: DrawableType.TailUp, row: 2, col: 3 },
      { type: DrawableType.TailRight, row: 2, col: 4 },
      { type: DrawableType.TailDown, row: 3, col: 4 },
      { type: DrawableType.TailLeft, row: 3, col: 3 },
      { type: DrawableType.BodyAngle135, row: 0, col: 0 },
      { type: DrawableType.BodyAngle45, row: 0, col: 2 },
      { type: DrawableType.BodyAngle315, row: 2, col: 2 },
      { type: DrawableType.BodyAngle225, row: 1, col: 0 },
      { type: DrawableType.BodyHorizontal, row: 0, col: 1 },
      { type: DrawableType.BodyVertical, row: 1, col: 2 },
      { type: DrawableType.Apple, row: 3, col: 0 },
    ];
  }

  async makeGameImages() {
    this.images.clear();
    const snakeImage = await this.loadImage(this.snakeSpriteUrl);
    const canvas = document.createElement('canvas');
    canvas.width = this.snakeElementSize;
    canvas.height = this.snakeElementSize;
    const ctx = canvas.getContext('2d')!;
    this.elements.forEach(async (x) => {
      const sx = x.col * this.snakeElementSize;
      const sy = x.row * this.snakeElementSize;
      const sw = this.snakeElementSize;
      const sh = this.snakeElementSize;
      const dw = this.snakeElementSize;
      const dh = this.snakeElementSize;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(snakeImage, sx, sy, sw, sh, 0, 0, dw, dh);
      const url = canvas.toDataURL();
      const image = await this.loadImage(url);
      this.images.set(x.type, image);
    });
  }

  getImage(type: DrawableType): HTMLImageElement {
    return this.images.get(type)!;
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => {
        resolve(image);
      });
    });
  }
}
