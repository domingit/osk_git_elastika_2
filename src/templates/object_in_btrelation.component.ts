import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { ObjectService } from './object.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'object-btrelation',
    templateUrl: './object_in_btrelation.component.html'
})

export class ObjectBTRelationComponent {
    $btrelSearchResult: any; 
    btrelSearchResult: any;
    sortPropBTRel = '';
    sortReverseBTRel = false;
    requestedItemCount = 20;
    totalItemCount = 0;
    moreData = false;
    btrelText: any;
    id: any;

    constructor(private _router: Router, private elastic: ElasticSearchService, private service: ObjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.$btrelSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInBTRelModel(id, this.requestedItemCount)
            )
            .subscribe((item) => {
                this.btrelSearchResult = this.sortData(item);
                this.id = this._router.url.split('=')[1];
                this.totalItemCount = this.elastic.btrelTotal;

                if(this.btrelSearchResult.length < this.totalItemCount){
                    this.moreData = true;

                    if(this.totalItemCount > 200){
                        this.btrelText = '>>> Get all ' + this.totalItemCount + ' results (Warning: Hundreds results can slow down your browser!)';
                    } else{
                        this.btrelText = '>>> Get all ' + this.totalItemCount + ' results ...';
                    }
                } else{
                    this.moreData = false;
                    this.btrelText = '';
                }

        /*        if(!item[0]){
                    this.service.setSearchLabel('NO DATA');
                } else{
                    this.service.setSearchLabel(item[0]._source.subject_name);
            }*/
             });

        this.sortPropBTRel = this.service.sortPropBTRel;
        this.sortReverseBTRel = this.service.sortReverseBTRel;
    }

    private getMoreData() {
        this.btrelText='Loading ...';
        this.$btrelSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInBTRelModel(id, this.totalItemCount, true)
            )
            .subscribe((item) => {
                this.btrelSearchResult = this.sortData(item);
                this.requestedItemCount = this.totalItemCount;
                this.moreData = false;
                this.$btrelSearchResult.unsubscribe();
            });
    }

    private getSearchLabel(): boolean {
        return this.service.getSearchLabel();
    }

    private sortData(data, property?, type?) {
        if (property){
            this.sortPropBTRel = property;
            this.sortReverseBTRel = !type;
            this.service.sortPropBTRel = property;
            this.service.sortReverseBTRel = !type;
        } else {
            property=this.sortPropBTRel;
            type=!this.sortReverseBTRel;
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

