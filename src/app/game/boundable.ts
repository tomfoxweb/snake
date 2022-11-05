export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Boundable {
  getBounds(): Rectangle;
}
