import {Component, Input} from '@angular/core';
import { ObjectService } from "templates/object.service";
import { AppComponent } from "app/app.component";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() showHeader:any;
  @Input() showFooter:any;

  public visible = false;
  public visibleAnimate = false;

  constructor(private objectService: ObjectService, private appComp: AppComponent){
    this.visible = false;
    this.visibleAnimate = false;
    this.objectService.modal$
          .subscribe(
                (
                  modal) => {this.visible = !modal;
                  this.visibleAnimate = !modal;
                }
    );
  }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
    //this.visible = this.service.show();
    //setTimeout(() => this.visibleAnimate = this.service.show(), 100);
  }

  public hide(): void {
    this.appComp.setCookies();
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  public close(): void {
      this.hide();
  }

}
