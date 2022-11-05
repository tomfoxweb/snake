import { Rectangle } from './boundable';

export function intersect(a: Readonly<Rectangle>, b: Readonly<Rectangle>) {
  return (
    a.x <= b.x + b.w && a.x + a.w >= b.x && a.y + a.h >= b.y && a.y <= b.y + b.h
  );
}
