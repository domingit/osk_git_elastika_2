import {Component, Input} from '@angular/core';
import { AppComponent } from './app.component';
import { ElasticSearchService } from '../elastic/elasticsearch.service';

@Component({
  selector: 'ngbd-buttons-checkbox',
  templateUrl: './buttons_checkbox.html'
})
export class NgbdButtonsCheckbox {
    @Input() indexAliasesModel: any;

    constructor(private elastic: ElasticSearchService){}

    onClick(index) {
      this.elastic.saveCookies();
    }
}
