import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { Jsonp, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router, ActivatedRoute } from '@angular/router';
import { ObjectService } from "templates/object.service";
import { LocationStrategy } from "@angular/common";
import { _do } from "rxjs/operator/do";
import { switchMap } from "rxjs/operator/switchMap";
import { distinctUntilChanged } from "rxjs/operator/distinctUntilChanged";
import { debounceTime } from "rxjs/operator/debounceTime";
import { _catch } from "rxjs/operator/catch";
import { of } from "rxjs/observable/of";

@Component({
  selector: 'ngbd-typeahead-template',
  templateUrl: './typeahead-basic.html',
  styleUrls: ['./loading.css'],
})
export class NgbdTypeaheadTemplate {

  model: any;
  searching = false;
  searchFailed = false;
  $respSearchResult: any;
  respSearchResult: any;
  signedIn = true;
  id: any;
  sub: any;
  searchText: any;
  indexLength: number;
  searchName: any;
  typeHeadColor = 'black';
  termlength: number;

  constructor(private route: ActivatedRoute, private _router: Router, private locationStrategy: LocationStrategy, private elastic: ElasticSearchService, private objectService: ObjectService) {
    this.searchText = this.objectService.searchText;
    this._router.events
      .subscribe(
      (url: any) => {
        let _ruta = "";
        url.url.split("/").forEach(element => {
          if (element !== "" && _ruta === "")
          { _ruta = "/" + element; }
        });
      });

      this.objectService.signn$.subscribe(
                (signn) => {this.signedIn = signn;
                  this.searchText = this.objectService.getPlaceholder(signn);
                }
            );
      
      this.objectService.searchName$.subscribe(
                (searchName) => {this.model = searchName;
                  this.searchName = searchName;
                }
            );
  }

    search = (text$: Observable<string>) =>
    _do.call(
      switchMap.call(
        _do.call(
          distinctUntilChanged.call(
            debounceTime.call(text$, 300)),
          () => {
            this.indexLength =  this.elastic.getIndices().length;
            this.termlength = 1;
            if(this.indexLength==0){
              alert('You do not have selected any index. You must choose at least one in Settings');
            }
            else{
              this.searching = true;
              //this.typeHeadColor = "blue";
            }
          }),
        term =>
          term.length < 2 || this.indexLength === 0 ? of([]) :
          this.indexLength === 0 ? _catch.call(
            of.call([])
            ) :
          _catch.call(
            _do.call(this.elastic.suggest(term), () => {this.searchFailed = false;
              this.termlength=term.length;
              }),
            (data) => {
              this.searchFailed = true;
              this.searching = false;
              this.typeHeadColor = "red";
              return of.call([]);
            }
          )
      ),
      (data) => {this.searching = false
            data.length > 0 || this.termlength===1 ? this.typeHeadColor = "black" : this.typeHeadColor = "red";
      });

    formatter = (x: { _source: any }) =>
    this.searchName;  

     valuechange(newValue) {
    //console.log(newValue);
  }

  selectedItem(item) {
    this.objectService.emitSubjectSearch(item.item._source.name);
    this.objectService.selectedItemId = item.item._id;
    this.objectService.emitSubject(item.item._type);

    if(this._router.url=='/main'){
      this._router.navigate(['object/info'], {queryParams: {id: item.item._id}});
    }
    else {
      this._router.navigate([this._router.url.split('?')[0]], {queryParams: {id: item.item._id}});
    }
  }
}
