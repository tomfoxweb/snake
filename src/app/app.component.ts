import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Game } from './game/game';
import { ImageProviderService } from './image-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'snake';
  private game!: Game;
  private imagesLoaded = false;

  @ViewChild('canvasGame') canvasGame!: ElementRef<HTMLCanvasElement>;

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
    this.game = new Game(this.imageProvider, canvas);
  }

  restart() {
    if (!this.imagesLoaded) {
      return;
    }
    this.game.restart();
  }
}
