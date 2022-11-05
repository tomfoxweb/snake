import { Boundable, Rectangle } from './boundable';
import { Drawable } from './drawable';

export class GameObject implements Boundable, Drawable {
  protected x: number;
  protected y: number;
  protected readonly size = 64;
  private image: HTMLImageElement;

  constructor(x: number, y: number, image: HTMLImageElement) {
    this.x = Math.trunc(x - (x % this.size));
    this.y = Math.trunc(y - (y % this.size));
    this.image = image;
  }

  getBounds(): Readonly<Rectangle> {
    return { x: this.x, y: this.y, w: this.size, h: this.size };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}
