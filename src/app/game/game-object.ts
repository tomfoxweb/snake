import { Boundable, Rectangle } from './boundable';
import { Drawable } from './drawable';

export class GameObject implements Boundable, Drawable {
  public static readonly size = 32;
  private static readonly scale = GameObject.size - 2;
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

  public setX(x: number) {
    this.x = x;
  }

  public setY(y: number) {
    this.y = y;
  }

  public setImage(image: HTMLImageElement) {
    this.image = image;
  }

  public getImage(): Readonly<HTMLImageElement> {
    return this.image;
  }

  getBounds(): Readonly<Rectangle> {
    return {
      x: this.x * GameObject.scale,
      y: this.y * GameObject.scale,
      w: GameObject.scale - 2,
      h: GameObject.scale - 2,
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
