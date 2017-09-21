import {Component, Input} from '@angular/core';
import { ObjectService } from "templates/object.service";

@Component({
  selector: 'about-body',
  templateUrl: './about.component.html'
})
export class AboutComponent {
signedIn=false;
constructor(private service: ObjectService){
  this.service.signn$.subscribe(
                (signn) => {this.signedIn = signn;
                }
    );
}


  public getMeInfo(itemType,itemId): any {
    this.service.navigateToTabLink(itemType,itemId);
  }

  public closeModal(): any {
    //this.service.emitSubjectSign(true);
    this.service.emitSubjectModal(true);
  }

}