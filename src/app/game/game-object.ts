import { Boundable, Rectangle } from './boundable';
import { Drawable } from './drawable';

export class GameObject implements Boundable, Drawable {
  public static readonly size = 64;
  private x: number;
  private y: number;
  private image: HTMLImageElement;

  constructor(x: number, y: number, image: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  protected setX(x: number) {
    this.x = x;
  }

  protected setY(y: number) {
    this.y = y;
  }

  getBounds(): Readonly<Rectangle> {
    return {
      x: this.x * GameObject.size,
      y: this.y * GameObject.size,
      w: GameObject.size,
      h: GameObject.size,
    };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const x = this.getX() * GameObject.size;
    const y = this.getY() * GameObject.size;
    ctx.drawImage(this.image, x, y, GameObject.size, GameObject.size);
    ctx.restore();
  }
}
