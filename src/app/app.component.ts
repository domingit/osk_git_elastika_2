import { Component, Input, OnInit } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { NgbdButtonsCheckbox } from './buttons_checkbox';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { ObjectService } from "templates/object.service";
import { unescape } from "querystring";
import {CookieService} from 'ngx-cookie';

import { KeycloakService } from './keycloak.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    navCollapsed = false;
    isIn = false;   // store state
    signedIn = true;
    searchText='';
    indexAliasesModel : any;
    authz : any;

    //constructor(public http: Http, private elastic: ElasticSearchService, private objectService: ObjectService, private kc: KeycloakService, private _cookieService:CookieService) {
    constructor(public http: Http, private elastic: ElasticSearchService, private objectService: ObjectService, private kc: KeycloakService) {
        this.searchText = this.objectService.searchText;
        this.signedIn = this.objectService.signedIn;

	//This is setting elastic.Model as Model for buttons
        this.indexAliasesModel = this.elastic.getIndicesModel();
    }

    public setCookies(){
    }

    ngOnInit(){
        this.authz = this.kc.getUserInfo();

        if (this.authz){
            this.signedIn=this.authz.loggedIn;
            this.objectService.signedIn = this.signedIn;
            this.objectService.emitSubjectSign(this.signedIn);
            this.objectService.emitSubjectAuth(this.authz);
        }
    }

    logout() {
        this.kc.logout();
    }

    setIndices(index){
        return this.elastic.setIndices(index);
    }

    toggleState() {
        let bool = this.isIn;
        this.isIn = bool === false ? true : false;
    }

    signIn = function(){
        this.kc.auth.authz.login();
    }

    signOut = function(){
        this.kc.signOut({redirectUri: this.objectService.logout_redirect_uri});
    }

    navigateHome(){
      this.objectService.navigateToHome();
    }

    clearSearch(){
         this.objectService.emitSubjectSearch("");
    }
}
