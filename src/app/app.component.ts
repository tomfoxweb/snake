import { AfterViewInit, Component } from '@angular/core';
import { DrawableType } from './game/drawable';
import { ImageProviderService } from './image-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'snake';

  constructor(private imageProvider: ImageProviderService) {}

  async ngAfterViewInit() {
    await this.imageProvider.makeGameImages();
  }
}
