import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { ObjectService } from './object.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'object-product',
    templateUrl: './object_in_product.component.html'
})

export class ObjectProductComponent{
    $prodSearchResult: any;
    prodSearchResult: any;
    sortPropProd = '';
    sortReverseProd = false;
    requestedItemCount = 20;
    totalItemCount = 0;
    moreData = false;
    prodText: any;
    id: any;

    constructor(private _router: Router, private elastic: ElasticSearchService, private service: ObjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.$prodSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInProdModel(id, this.requestedItemCount)
            )
            .subscribe((item) => {
                this.prodSearchResult = this.sortData(item);
                this.id = this._router.url.split('=')[1];
                this.totalItemCount = this.elastic.prodTotal;

                if(this.prodSearchResult.length < this.totalItemCount){
                    this.moreData = true;

                    if(this.totalItemCount > 200){
                        this.prodText = '>>> Get all ' + this.totalItemCount + ' results (Warning: Hundreds results can slow down your browser!)';
                    } else{
                        this.prodText = '>>> Get all ' + this.totalItemCount + ' results ...';
                    }
                } else{
                    this.moreData = false;
                    this.prodText = '';
                }

        /*        if(!item[0]){
                    this.service.setSearchLabel('NO DATA');
                } else{
                    this.service.setSearchLabel(item[0]._source.subject_name);
            }*/
             });

        this.sortPropProd = this.service.sortPropProd;
        this.sortReverseProd = this.service.sortReverseProd;
    }

    private getMoreData() {
        this.prodText='Loading ...';
        this.$prodSearchResult = this.route
            .queryParams
            .map(params => params.id)
            .flatMap((id) =>
                this.elastic.searchInProdModel(id, this.totalItemCount, true)
            )
            .subscribe((item) => {
                this.prodSearchResult = this.sortData(item);
                this.requestedItemCount = this.totalItemCount;
                this.moreData = false;
                this.$prodSearchResult.unsubscribe();
            });
    }

    private getSearchLabel(): boolean {
        return this.service.getSearchLabel();
    }

    private sortData(data, property?, type?) {
        if (property){
	    this.sortPropProd = property;
            this.sortReverseProd = !type;
            this.service.sortPropProd = property;
            this.service.sortReverseProd = !type;
        } else {
            property = this.sortPropProd;
            type = !this.sortReverseProd;
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

