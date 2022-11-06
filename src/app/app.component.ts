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
  snakeLength = 3;
  private game!: Game;
  private imagesLoaded = false;
  private isPaused = false;

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
  }

  restart() {
    if (!this.imagesLoaded || !this.game) {
      return;
    }
    this.game.restart();
    this.isPaused = false;
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

  showSnakeLength(length: number) {
    this.snakeLength = length;
  }
}
