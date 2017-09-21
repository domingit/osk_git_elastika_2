import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Subject } from "rxjs";

@Injectable()
export class ObjectService {
    public selectedItemId;
    public label;
    public query;
    public _type;
    public infraSearchResult;
    public servSearchResult;
    public btrelSearchResult;
    public prodSearchResult;
    public signedIn;
    public searchText='';
    public account_url: 'https://idp.orange.sk/auth/realms/orange/account/?referrer=elastika';
    public logout_redirect_uri: 'https://elastika2.fe.sun.orange.sk/#/main';

    private _signSubject = new Subject<boolean>();
    public signn$ = this._signSubject.asObservable();
    public emitSubjectSign = (signn: boolean) => this._signSubject.next(signn);

    private _authSubject = new Subject<any>();
    public auth$ = this._authSubject.asObservable();
    public emitSubjectAuth = (auth: any) => this._authSubject.next(auth);

    private _modalSubject = new Subject<any>();
    public modal$ = this._modalSubject.asObservable();
    public emitSubjectModal = (modal: any) => this._modalSubject.next(modal);

    private _searchSubject = new Subject<any>();
    public searchName$ = this._searchSubject.asObservable();
    public emitSubjectSearch = (searchName: any) => this._searchSubject.next(searchName);


    private _typeSubject = new Subject<string>();
    public type$ = this._typeSubject.asObservable();
    public emitSubject = (type: string) => this._typeSubject.next(type);

    private _titleSubject = new Subject<string>();
    public title$ = this._titleSubject.asObservable();
    public emitSubjectTitle = (title: string) => this._titleSubject.next(title);

    public sortPropResp = 'subject_name';
    public sortPropBTRel = 'what_a_name';
    public sortPropServ = 'service_name';
    public sortPropInfra = 'system_name';
    public sortPropProd = 'service_name';
    public sortReverseResp = false;
    public sortReverseBTRel = false;
    public sortReverseServ = false;
    public sortReverseInfra = false;
    public sortReverseProd = false;

    public navigateTitle = {
        Person:'/object/respmodel',
        Vendor:'/object/respmodel',
        System:'/object/servmodel',
        Service:'/object/servmodel',
        Process:'/object/servmodel',
        'Process interface':'/object/servmodel',
        Product:'/object/prodmodel',
        'Archive TV channel':'/object/servmodel',
        'Tel. number':'/object/servmodel',
        'IVR number':'/object/servmodel',
        'NPVR':'/object/servmodel',
        'Radio channel':'/object/servmodel',
        'SMS number':'/object/servmodel',
        'TV channel':'/object/servmodel',
        'VOD':'/object/servmodel',
        Server:'/object/inframodel',
        'Business term':'/object/btrelmodel',
        'Data area':'/object/btrelmodel',
	'Default':'/object/inframodel'
    }

    public tabs = [
        {title: 'Object Info', icon: 'fa fa-fw fa-info', content: 'Object Info', disabled: false, hidden: false, active:false, routerLink:'/object/info', queryParams: {id: this.selectedItemId}},
        {title: 'Product model', icon: 'fa fa-fw fa-industry', content: 'Product model', disabled: false, hidden: false, active:false, routerLink:'/object/prodmodel', queryParams: {id: this.selectedItemId}},
        {title: 'Service model', icon: 'fa fa-fw fa-coffee', content: 'Service model', disabled: false, hidden: false, active:false, routerLink:'/object/servmodel', queryParams: {id: this.selectedItemId}},
        {title: 'Infra model', icon: 'fa fa-fw fa-database', content: 'Infra model', disabled: false, hidden: false, active:false, routerLink:'/object/inframodel', queryParams: {id: this.selectedItemId}},
        {title: 'BT model', icon: 'fa fa-fw fa-book', content: 'BT model', disabled: false, hidden: false, active:false, routerLink:'/object/btrelmodel', queryParams: {id: this.selectedItemId}},
        {title: 'Responsibility', icon: 'fa fa-fw fa-group', content: 'Responsibility', disabled: false, hidden: false, active:false, routerLink:'/object/respmodel', queryParams: {id: this.selectedItemId}},
    ];

    /*public indexAliasesModel = [
      {type: "alias_systems", value : true, name: "System"},
      {type: "alias_services", value: true, name: "Service"},
      {type: "alias_products", value: true, name: "Product"},
      {type: "alias_information_carriers", value: true, name: "Infocarrier"},
      {type: "alias_servers", value: true, name: "Server"},
      {type: "alias_people", value: true, name: "Person"},
      {type: "alias_vendors", value: true, name: "Vendor"},
      {type: "alias_consist_depend_objects", value: false, name: "Infra"},
      {type: "alias_processes", value: false, name: "Process"},
      {type: "alias_process_interfaces", value: false, name: "Process intf."},
      {type: "alias_business_terms", value: false, name: "Business term"},
      {type: "alias_data_areas", value: false, name: "Data area"}
  ]; */

  public tabsConfig = {
      Person:['Object Info', 'Responsibility'],
      Vendor:['Object Info', 'Responsibility'],
      System:['Object Info', 'Service model', 'Infra model', 'Responsibility'],
      Service:['Object Info', 'Product model', 'Service model', 'Responsibility'],
      Process:['Object Info', 'Service model'],
      'Process interface':['Object Info', 'Service model'],
      Product:['Object Info', 'Product model'],
      'Archive TV channel':['Object Info', 'Service model'],
      'Tel. number':['Object Info', 'Service model'],
      'IVR number':['Object Info', 'Service model'],
      'NPVR':['Object Info', 'Service model'],
      'Radio channel':['Object Info', 'Service model'],
      'SMS number':['Object Info', 'Service model'],
      'TV channel':['Object Info', 'Service model'],
      'VOD':['Object Info', 'Service model'],
      Server:['Object Info', 'Infra model'],
      'Business term':['Object Info', 'BT model', 'Responsibility'],
      'Data area':['Object Info', 'BT model', 'Responsibility'],
      'Default':['Object Info', 'Infra model']
  }

    constructor(private _router: Router, @Inject(DOCUMENT) private document: any){
        if (this.signedIn != true || this.signedIn != true)
        {
            this.signedIn = true;
        }

        if(this.signedIn){
            this.searchText = "Start typing something to search...";
        } else{
            this.searchText = "You are not signed in !!!!"
        }
    }

    public getPlaceholder(signed) {
        if(signed){
            this.searchText = "Start typing something to search...";
        } else{
            this.searchText = "You are not signed in !!!!"
        }
        return this.searchText;
    }

    public sortByProperty(property, asc) {
        return function (x, y) {
            if (asc) {
                return ((x._source[property] === y._source[property]) ? 0 : ((x._source[property] > y._source[property]) ? 1 : -1));
            }
            else {
                return ((x._source[property] === y._source[property]) ? 0 : ((x._source[property] < y._source[property]) ? 1 : -1));
            }
        };
    };

    public navigateToTab(itemType,itemId,itemName?): any  {
        if(itemName){
            this.emitSubjectSearch(itemName);
        }

	if(this.navigateTitle[itemType] == null){
	    itemType = 'Default';
	}

        this._router.navigate([this.navigateTitle[itemType]], {queryParams: {id: itemId}});
    }

    public navigateToTabLink(tabLink,itemId,itemName?): any  {
        if(itemName){
            this.emitSubjectSearch(itemName);
        }

        this._router.navigate([tabLink], {queryParams: {id: itemId}});
    }

    public navigateToHome(): any  {
        this._router.navigate(['/main']);
    }

    public navigateToOutPage(page): any  {
        this._router.ngOnDestroy();

        if(page='account') {
            this.document.location.href ='https://idp.orange.sk/auth/realms/orange/account/?referrer=elastika';
        }
    }

    public updateGetUrl(systemId, itemName?): any {
        if(itemName){
            this.emitSubjectSearch(itemName);
        }

        this._router.navigate([this._router.url.split('?')[0]], {queryParams: {id: systemId}});
    }

    public getSearchLabel(): boolean {
        if(this._router.url == "/main") {
          this.label = null;
          return false;
	} else {
            return this.label;
        }
    }

    public setSearchLabel(val): any {
        this.label = val;
        this.query = val;
    }

    public filterTabs(type: string) {
	if(this.tabsConfig[type] == null){
	    type = 'Default';
	}

        const allowedTabs = this.tabsConfig[type];

        return allowedTabs ? this.tabs.map(
            (tab) => ({ ...tab, hidden: !allowedTabs.includes(tab.title) })
        ) : this.tabs
    }
}
