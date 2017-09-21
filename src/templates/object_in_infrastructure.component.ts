import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { ObjectService } from './object.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'object-infrastructure',
    templateUrl: './object_in_infrastructure.component.html'
})

export class ObjectInfrastructureComponent{
    $infraSearchResult: any;
    infraSearchResult: any;
    sortPropInfra = '';
    sortReverseInfra = false;
    requestedItemCount = 20;
    totalItemCount = 0;
    moreData = false;
    infraText: any;
    id: any;

    constructor(private _router: Router, private elastic: ElasticSearchService, private service: ObjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.$infraSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInInfraModel(id, this.requestedItemCount)
            )
            .subscribe((item) => {
                this.infraSearchResult = this.sortData(item);
                this.id = this._router.url.split('=')[1];
                this.totalItemCount = this.elastic.infraTotal;

                if(this.infraSearchResult.length < this.totalItemCount){
                    this.moreData = true;

                    if(this.totalItemCount > 200){
                        this.infraText = '>>> Get all ' + this.totalItemCount + ' results (Warning: Hundreds results can slow down your browser!)';
                    } else{
                        this.infraText = '>>> Get all ' + this.totalItemCount + ' results ...';
                    }
                } else{
                    this.moreData = false;
                    this.infraText = '';
                }

        /*        if(!item[0]){
                    this.service.setSearchLabel('NO DATA');
                } else{
                    this.service.setSearchLabel(item[0]._source.subject_name);
            }*/
             });

        this.sortPropInfra = this.service.sortPropInfra;
        this.sortReverseInfra = this.service.sortReverseInfra;
    }

    private getMoreData() {
        this.infraText='Loading ...';
        this.$infraSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInInfraModel(id, this.totalItemCount, true)
            )
            .subscribe((item) => {
                this.infraSearchResult = this.sortData(item);
                this.requestedItemCount = this.totalItemCount;
                this.moreData = false;
                this.$infraSearchResult.unsubscribe();
            });
    }

    private getSearchLabel(): boolean {
        return true;
    }

    private sortData(data,property?, type?) {
        if (property){
	    this.sortPropInfra = property;
            this.sortReverseInfra = !type;
            this.service.sortPropInfra = property;
            this.service.sortReverseInfra = !type;
        } else {
            property = this.sortPropInfra;
            type = !this.sortReverseInfra;
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

