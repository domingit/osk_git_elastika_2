import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { Injectable } from '@angular/core';
import { ObjectService } from './object.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'object-info',
    templateUrl: './object_info.component.html'
})

@Injectable()

export class ObjectInfoComponent{
    $items: any;
    item: any;
    sortPropResp = '';
    sortReverseResp = false;
    navigateTitle: any; 
    id: any;

    constructor(private _router: Router, private elastic: ElasticSearchService, private service: ObjectService, private route: ActivatedRoute) {
    
        this.$items = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.getObjectById(id)
            )
            .subscribe((item) => { this.item = item;
            this.id = this._router.url.split('=')[1];
            if(item == null){
                //this.service.setSearchLabel('NO DATA');
		//alert('Ooops ... data mischmatch. Application need to be initialized.');
		//this.service.navigateToHome();
		//this.service.emitSubjectSearch("");
            }
            /*else{
                this.service.setSearchLabel(item[0]._source.name);
                this.service.emitSubjectSearch(item[0]._source.name);
                this.service.emitSubject(item[0]._type);
            }*/
             });
        this.sortPropResp = this.service.sortPropResp;
        this.sortReverseResp = this.service.sortReverseResp;


    }

    public getSearchLabel(): boolean {
        return true;
    }

    private navigateToTab(itemType,itemId, itemName?): any  {
        this.service.navigateToTab(itemType,itemId,itemName);
    }

    private navigateToTabLink(tabLink,itemId, itemName?): any  {
        this.service.navigateToTabLink(tabLink,itemId, itemName);
    }
}

