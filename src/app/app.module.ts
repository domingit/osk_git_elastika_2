import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions, JsonpModule } from '@angular/http';
// import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadModule } from '../ng-bootstrap/typeahead/typeahead.module';
import { ModalComponent} from '../modal_window/modal.component';
import { NgbdButtonsCheckbox } from './buttons_checkbox';
import { platformBrowserDynamic} from '@angular/platform-browser-dynamic';
//import { TabsModule } from 'ngx-bootstrap';

import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

import { AppComponent } from './app.component';

import { AppRoutingModule }     from './app-routing.module';

import { ObjectInfoComponent }  from '../templates/object_info.component';
import { ObjectServiceComponent} from '../templates/object_in_service.component';
import { ObjectResponsibilityComponent} from '../templates/object_in_responsibility.component';
import { ObjectBTRelationComponent} from '../templates/object_in_btrelation.component';
import { ObjectProductComponent} from '../templates/object_in_product.component';
import { ObjectInfrastructureComponent} from '../templates/object_in_infrastructure.component';
import { ObjectBodyComponent}    from '../templates/object.component';
import { ObjectMainBodyComponent}    from '../templates/object_main.component';
import { ObjectService }        from '../templates/object.service';
import { ElasticSearchService } from '../elastic/elasticsearch.service';
import { FooterComponent }      from '../footer/footer.component';
import { ProfBodyComponent }    from '../footer/profile_body.component';
import { AboutComponent }    from '../footer/about.component';
import { LinksComponent }       from '../footer/links.component';
import { LinksCompComponent }       from '../footer/links_comp.component';
import { ContactsComponent }    from '../footer/contacts.component';
import { OrangeComponent }    from '../footer/orange.component';
import { NewsComponent }        from '../footer/news.component';
import { NgbdTypeaheadTemplate } from './typeahead-basic';
import { KeycloakService }      from './keycloak.service';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';
import { CustomHttp }      from './http.service';

//import { CookieService } from 'ngx-cookie-service';

import { CookieModule } from 'ngx-cookie';
//import { MaterialModule } from '@angular/material';
import { Md2Module }  from 'md2';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
//import { Ng2KeycloakModule } from '@ebondu/angular2-keycloak';

/*export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'token',
    tokenGetter: (() => KeycloakService.auth.authz.token),
    globalHeaders: [{ 'Content-Type': 'application/json' }],
  }), http, options);
}*/

@NgModule({
  declarations: [
    AppComponent,
    NgbdButtonsCheckbox,
    ModalComponent,
    ObjectInfoComponent,
    ObjectServiceComponent,
    ObjectMainBodyComponent,
    ObjectResponsibilityComponent,
    ObjectBTRelationComponent,
    ObjectProductComponent,
    ObjectInfrastructureComponent,
    ObjectBodyComponent,
    ProfBodyComponent,
    AboutComponent,
    ContactsComponent,
    OrangeComponent,
    FooterComponent,
    LinksComponent,
    LinksCompComponent,
    NewsComponent,
    NgbdTypeaheadTemplate
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
//    MaterialModule,
    ReactiveFormsModule,
    JsonpModule,
    Md2Module,
    // NgbModule.forRoot(),
    NgbTypeaheadModule.forRoot(),
    CookieModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule
    //TabsModule.forRoot(),
    //MultiselectDropdownModule
  ],
  providers: [
    ElasticSearchService, 
    ObjectService,
    //CookieService,
    KeycloakService,
    {
      provide: Http,
      useClass: CustomHttp
    } 
    /*{
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },*/
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
