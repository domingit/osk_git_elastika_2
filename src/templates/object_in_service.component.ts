import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { ObjectService } from './object.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'object-service',
    templateUrl: './object_in_service.component.html'
})

export class ObjectServiceComponent{
    $servSearchResult: any;
    servSearchResult: any;
    sortPropServ = '';
    sortReverseServ = false;
    requestedItemCount = 20;
    totalItemCount = 0;
    moreData = false;
    servText: any;
    id: any;

    constructor(private _router: Router, private elastic: ElasticSearchService, private service: ObjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.$servSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInServModel(id, this.requestedItemCount)
            )
            .subscribe((item) => {
                this.servSearchResult = this.sortData(item);
                this.id = this._router.url.split('=')[1];
                this.totalItemCount = this.elastic.servTotal;

                if(this.servSearchResult.length < this.totalItemCount){
                    this.moreData = true;

                    if(this.totalItemCount > 200){
                        this.servText = '>>> Get all ' + this.totalItemCount + ' results (Warning: Hundreds results can slow down your browser!)';
                    } else{
                        this.servText = '>>> Get all ' + this.totalItemCount + ' results ...';
                    }
                } else{
                    this.moreData = false;
                    this.servText = '';
                }
             });

        this.sortPropServ = this.service.sortPropServ;
        this.sortReverseServ = this.service.sortReverseServ;
    }

    private getMoreData() {
        this.servText='Loading ...';
        this.$servSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInServModel(id, this.totalItemCount, true)
            )
            .subscribe((item) => {
                this.servSearchResult = this.sortData(item);
                this.requestedItemCount = this.totalItemCount;
                this.moreData = false;
                this.$servSearchResult.unsubscribe();
            });
    }

    private getSearchLabel(): boolean {
        return true;
    }

    private sortData(data,property?, type?) {
        if (property){
	    this.sortPropServ = property;
            this.sortReverseServ = !type;
            this.service.sortPropServ = property;
            this.service.sortReverseServ = !type;
        } else {
            property = this.sortPropServ;
            type = !this.sortReverseServ;
        }

        return data.sort(this.service.sortByProperty(property, type));
    }

    private navigateToTab(itemType,itemId): any  {
        this.service.navigateToTab(itemType,itemId);
    }

    private navigateToTabLink(tabLink,itemId, itemName?): any  {
        this.service.navigateToTabLink(tabLink,itemId, itemName);
    }

    private updateGetUrl(systemId, itemName?): any {
        this.requestedItemCount = 20;
	this.totalItemCount = 0;
        this.service.updateGetUrl(systemId, itemName);
    }
}

