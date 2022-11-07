import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Game } from './game/game';
import { ImageProviderService } from './image-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'snake';
  pauseCaption = 'Pause';
  score = 0;
  private game!: Game;
  private imagesLoaded = false;
  private isPaused = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchEndX = 0;
  private touchEndY = 0;

  @ViewChild('canvasGame') canvasGame!: ElementRef<HTMLCanvasElement>;

  @HostListener('window:keydown.ArrowUp', ['$event'])
  handleArrowUp(event: KeyboardEvent) {
    if (this.imagesLoaded && this.game) {
      this.game.up();
    }
  }

  @HostListener('window:keydown.ArrowDown', ['$event'])
  handleArrowDown(event: KeyboardEvent) {
    if (this.imagesLoaded && this.game) {
      this.game.down();
    }
  }

  @HostListener('window:keydown.ArrowRight', ['$event'])
  handleArrowRight(event: KeyboardEvent) {
    if (this.imagesLoaded && this.game) {
      this.game.right();
    }
  }

  @HostListener('window:keydown.ArrowLeft', ['$event'])
  handleArrowLeft(event: KeyboardEvent) {
    if (this.imagesLoaded && this.game) {
      this.game.left();
    }
  }

  @HostListener('window:touchstart', ['$event'])
  handleTouchDown(event: TouchEvent) {
    if (event.changedTouches.length > 0) {
      const x = event.changedTouches[0].clientX;
      const y = event.changedTouches[0].clientY;
      this.setStartTouchPosition(x, y);
    }
  }

  @HostListener('window:touchend', ['$event'])
  handleTouchEnd(event: TouchEvent) {
    if (event.changedTouches.length > 0) {
      const x = event.changedTouches[0].clientX;
      const y = event.changedTouches[0].clientY;
      this.setEndTouchPosition(x, y);
      this.processPointerMove();
    }
  }

  constructor(private imageProvider: ImageProviderService) {}

  async ngAfterViewInit() {
    await this.imageProvider.makeGameImages();
    const canvas = this.canvasGame.nativeElement;
    const css = window.getComputedStyle(canvas);
    const width = Number.parseInt(css.width);
    const height = Number.parseInt(css.height);
    canvas.width = width;
    canvas.height = height;
    this.imagesLoaded = true;
    this.game = new Game(this.imageProvider, canvas, this);
    this.pause();
  }

  restart() {
    if (!this.imagesLoaded || !this.game) {
      return;
    }
    this.game.restart();
    this.isPaused = false;
    this.pauseCaption = 'Pause';
  }

  pause() {
    if (!this.imagesLoaded || !this.game) {
      return;
    }
    if (this.isPaused) {
      this.game.resume();
      this.isPaused = false;
      this.pauseCaption = 'Pause';
    } else {
      this.game.pause();
      this.isPaused = true;
      this.pauseCaption = 'Resume';
    }
  }

  showScore(length: number) {
    this.score = length;
  }

  private setStartTouchPosition(x: number, y: number): void {
    this.touchStartX = x;
    this.touchStartY = y;
  }

  private setEndTouchPosition(x: number, y: number): void {
    this.touchEndX = x;
    this.touchEndY = y;
  }

  private processPointerMove(): void {
    const sx = Math.abs(this.touchEndX - this.touchStartX);
    const sy = Math.abs(this.touchEndY - this.touchStartY);
    if (sx + sy < 10) {
      return;
    }
    if (sx > sy) {
      if (this.touchEndX > this.touchStartX) {
        this.game.right();
      } else {
        this.game.left();
      }
    } else {
      if (this.touchEndY > this.touchStartY) {
        this.game.down();
      } else {
        this.game.up();
      }
      this.game.up();
    }
  }
}
