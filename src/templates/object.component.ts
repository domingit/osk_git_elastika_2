import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ObjectService } from "templates/object.service";

@Component({
    selector: 'object-body',
    templateUrl: './object.component.html',
    styleUrls: ['./object.component.css']
})

export class ObjectBodyComponent{
    head_title = "NO active TAB";
    isIn = false;   // store state
    id = '';
    actual_id = '';
    tabs:any = this.objectService.tabs;
    filteredTabs = this.tabs;
    tabsConfig: any;
    actualTab: any;

    isFirstTimeOpened = true;

    constructor(private _router: Router, private activatedRoute:ActivatedRoute, private objectService: ObjectService){
        //this.head_title="NO active TAB";
        this.tabsConfig =  this.objectService.tabsConfig;
        if(this.tabsConfig[this.objectService._type]) {
            for(let i in this.tabs){
                if(this.tabsConfig[this.objectService._type].indexOf(this.tabs[i].title)<0) {
                    this.tabs[i].hidden=true;
                } else {
                    this.tabs[i].hidden=false;
                }
            }
        }
        this._router.events
        .subscribe(
            (url:any) => {
                let _ruta = "";
                let _id = "";
                url.url.split("?").forEach(element => {
                    if(element !== "" && _ruta === ""){
			_ruta = element;
		    } else {
			_id = element;
		    }
                });
                this.actual_id = _id.split("=")[1];
                this.setActualPage(_ruta, this.actual_id);

            });

            this.objectService.type$.subscribe(
                (type) => {this.filteredTabs = this.objectService.filterTabs(type)
                    //this.head_title=type;
                    if (this.actualTab == "Object Info") {
                        this.head_title = type
                    }
                    var filteredTab = this.filteredTabs.find((a) => a.title === this.actualTab);
                    if(filteredTab) {
                        if(filteredTab.hidden){
                            this._router.navigate(['object/info'], {queryParams: {id: this.actual_id}});
                        }
                    }
                }
            );


    }

    setActualPage(_ruta,_id) {
        if((_ruta!='/' && _ruta!='/main' && !_id )|| (!this.objectService.signedIn && _id)) {
            this._router.navigate(['/main']);
        }
        else{
            var found = this.tabs.find((a) => a.routerLink === _ruta);
            if(found) {
                this.tabs[this.tabs.indexOf(found)].active=true;
                this.actualTab = this.tabs[this.tabs.indexOf(found)].title;
                if (this.actualTab != "Object Info") {
                    this.head_title=this.actualTab;
                }
            }
        }
    }

    toggleState() {
        let bool = this.isIn;
        this.isIn = bool === false ? true : false;
    }

    getSearchLabel() {
        return this.objectService.getSearchLabel();
    }
}

