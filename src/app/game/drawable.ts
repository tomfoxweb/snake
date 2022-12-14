export const enum DrawableType {
  HeadUp,
  HeadDown,
  HeadLeft,
  HeadRight,
  TailUp,
  TailDown,
  TailLeft,
  TailRight,
  BodyHorizontal,
  BodyVertical,
  BodyAngle45,
  BodyAngle135,
  BodyAngle225,
  BodyAngle315,
  Apple,
}

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}
