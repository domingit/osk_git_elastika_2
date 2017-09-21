import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { ObjectService } from './object.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'object-responsibility',
    templateUrl: './object_in_responsibility.component.html'
})

export class ObjectResponsibilityComponent {
    $respSearchResult: any; 
    respSearchResult: any;
    sortPropResp = '';
    sortReverseResp = false;
    requestedItemCount = 20;
    totalItemCount = 0;
    moreData = false;
    respText: any;
    id: any;
 
    constructor(private _router: Router, private elastic: ElasticSearchService, private service: ObjectService, private route: ActivatedRoute) {}
    
    ngOnInit() {
        this.$respSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInRespModel(id, this.requestedItemCount)
            )
            .subscribe((item) => {
		//this.respSearchResult = this.service.respSearchResult = this.sortData(item);
		this.respSearchResult = this.sortData(item);
                this.id = this._router.url.split('=')[1];
                this.totalItemCount = this.elastic.respTotal;

                if(this.respSearchResult.length < this.totalItemCount){
                    this.moreData = true;

		    if(this.totalItemCount > 200){
                    	this.respText = '>>> Get all ' + this.totalItemCount + ' results (Warning: Hundreds results can slow down your browser!)';
		    } else{
                    	this.respText = '>>> Get all ' + this.totalItemCount + ' results ...';
		    }
                } else{
                    this.moreData = false;
                    this.respText = '';
                }

        /*        if(!item[0]){
                    this.service.setSearchLabel('NO DATA');
                } else{
                    this.service.setSearchLabel(item[0]._source.subject_name);
            }*/
             });

        this.sortPropResp = this.service.sortPropResp;
        this.sortReverseResp = this.service.sortReverseResp;
    }


    private getMoreData() {
        this.respText='Loading ...';
        this.$respSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInRespModel(id, this.totalItemCount, true)
            )
            .subscribe((item) => {
		//this.respSearchResult = this.service.respSearchResult =  this.sortData(item);
		this.respSearchResult = this.sortData(item);
		this.requestedItemCount = this.totalItemCount;
            	this.moreData = false;
		this.$respSearchResult.unsubscribe();
            });
    }

    private getSearchLabel(): boolean {
        return this.service.getSearchLabel();
    }

    private sortData(data, property?, type?) {
        if (property){
            this.sortPropResp = property;
            this.sortReverseResp = !type;
            this.service.sortPropResp = property;
            this.service.sortReverseResp = !type;
        } else {
            property = this.sortPropResp;
            type = !this.sortReverseResp;
        }

        return data.sort(this.service.sortByProperty(property, type));
    }

    private navigateToTab(itemType,itemId): any  {
        this.service.navigateToTab(itemType,itemId);
    }

    private navigateToTabLink(tabLink,itemId, itemName?): any  {
        this.service.navigateToTabLink(tabLink,itemId, itemName);
    }

    private updateGetUrl(itemId, itemName?): any {
        this.requestedItemCount = 20;
        this.totalItemCount = 0;
        this.service.updateGetUrl(itemId, itemName);
    }
}

