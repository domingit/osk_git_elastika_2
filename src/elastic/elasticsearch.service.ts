import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import elasticsearch from 'elasticsearch';
import { ObjectService } from "templates/object.service";
import { CookieService } from 'ngx-cookie';
import { KeycloakService } from '../app/keycloak.service';

@Injectable()
export class ElasticSearchService {

    public ES_uri: 'https://elastika2.fe.sun.orange.sk/';
    public account_url: 'https://idp.orange.sk/auth/realms/orange/account/?referrer=elastika';
    //URI for stabilization logout proces. otherwise application is trying to login again, because id is in URL
    //public logout_redirect_uri: 'https://localhost/elastika/app/index.html';
    public logout_redirect_uri: 'https://elastika2.fe.sun.orange.sk/elastika/app/index.html';

    private _client: elasticsearch.ClientInterface
    private servModelId: any;
    public infra_id;
    public infraSearchResult;
    public respSearchResult;
    public resp_id;
    public btrelSearchResult;
    public btrel_id;
    public prodSearchResult;
    public prod_id;
    public servSearchResult;
    public serv_id;
    public objSearchResult;
    public obj_id;

        public indexAliasesModel = [
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
      {type: "alias_data_areas", value: false, name: "Data area"},
    ];

    private defaultIndexAliasesModel = [
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
      {type: "alias_business_terms", value: true, name: "Business term"},
      {type: "alias_data_areas", value: true, name: "Data area"}
    ];

  public allowedIndices;
  public allIndices;
  public infraTotal;
  public servTotal;
  public prodTotal;
  public respTotal;
  public btrelTotal;

  public objectInf;

  //host: this.ES_uri,

  constructor(private ObjectService: ObjectService, private _cookieService:CookieService, private keyclock: KeycloakService) {
    this.setIndices(['cookies']);
    let token = "token";
     keyclock.getToken().then(token => {
        this._client = elasticsearch.Client(
        {
            host: {
                host: 'https://elastika2.fe.sun.orange.sk/',
                //host: 'localhost',
                //port: 9200,
                headers : {
                  'Authorization': 'Bearer ' + token
                },
                maxRetries: 0,
                requestTimeout: 5000,
                apiVersion: '5.3', //, log: 'trace'
              }
        }
        );
     });
  }

  public getIndices(){
      this.allowedIndices=[];

      for (let indexs in this.indexAliasesModel) {
          if(this.indexAliasesModel[indexs].value) {
              this.allowedIndices.push(this.indexAliasesModel[indexs].type);
          }
      }

      return this.allowedIndices;
  }

  public getAllIndices(){
      this.allIndices=[];
        for (let indexs in this.indexAliasesModel) {
            this.allIndices.push(this.indexAliasesModel[indexs].type);
        }
      return this.allIndices;
  }

  public getIndicesModel(){
        return this.indexAliasesModel;
  }

  public setIndicesModel(model){
	if(model[0].type !== undefined){
	    this.indexAliasesModel = model;
	}
  }

  public setIndices(index){
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    if(index[0] === 'cookies') {
      const cookiesJSON = this._cookieService.get('ES_index_aliases');
      if(cookiesJSON === undefined){
        this.indexAliasesModel = this.defaultIndexAliasesModel;
      } else {
        this.indexAliasesModel = JSON.parse(cookiesJSON);
      }
    } else {
        for (let entry in this.indexAliasesModel) {
          if(index.length==0){
            this.indexAliasesModel[entry].value=false;
          } else if(index[0]=="all"){
            this.indexAliasesModel[entry].value=true;
          } else if (index[0]=="default") {
            this.indexAliasesModel[entry].value = this.defaultIndexAliasesModel[entry].value;
          } else {
            if (index.indexOf(this.indexAliasesModel[entry].type) > -1) {
              this.indexAliasesModel[entry].value=true;
            } else {
              this.indexAliasesModel[entry].value=false;
            }
          }
        }
    }
        this._cookieService.put('ES_index_aliases', JSON.stringify(this.indexAliasesModel), {expires: new Date(tomorrow)});
        return this.indexAliasesModel;
    }

    saveCookies(){
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        this._cookieService.put('ES_index_aliases', JSON.stringify(this.indexAliasesModel), {expires: new Date(tomorrow)});
    }

  private _serverError(err: any) {
        if(err instanceof Response) {
          return Observable.throw(err.json().error || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }

  public suggest(val, index?) : any {
      var indices = this.getIndices();
      if(indices.length>0){
         return Observable.fromPromise(this._client.search({
            index: indices,
            body: {
                size: 20,
                sort: [{"_score": {order: "desc"}}, {"ordering": {order: "asc"}}, {"name.raw": {order: "asc"}}],
                query: {
		    bool:{
			should:[
 	                   {match:{
	                        "all":{
	                            query: val,
	                            operator: "and"
	                        }
	                    }},
			    {match:{
				"name":{
	                            query: val,
	                            operator: "and",
	                            boost: "5"
	                        }
			    }},
			    {match:{
				"alternative_name":{
	                            query: val,
	                            operator: "and",
	                            boost: "5"
	                        }
			    }},
			    {match:{
				"name.exact":{
	                            query: val,
	                            operator: "and",
	                            boost: "10"
	                        }
			    }},
			    {match:{
				"alternative_name.exact":{
	       	                    query: val,
	                            operator: "and",
	                            boost: "10"
	                        }
			    }}
			]
	            }
		},
                highlight: {
		    number_of_fragments: 1,
		    fragment_size: 80,
		    no_match_size: 80,
		    fragmenter:"simple",
		    require_field_match: false,
		    order: "score",
		    type:"unified",
      		    pre_tags: [
		       "<strong>"
		    ],
		    post_tags: [
			"</strong>"
		    ],
		    fields: {
			name: {number_of_fragments:0},
			alternative_name:{number_of_fragments:0},
			parent_term_name:{number_of_fragments:0},
			description:{number_of_fragments: 2},
			remark:{number_of_fragments: 2},
			login:{number_of_fragments: 0},
			orange_id:{number_of_fragments: 0},
			domain:{number_of_fragments: 0},
			subdomain:{number_of_fragments: 0},
			group:{number_of_fragments: 0},
			type:{number_of_fragments: 0},
			subtype:{number_of_fragments: 0},
			position_name:{number_of_fragments: 0},
			unit_name:{number_of_fragments: 0},
			company_name:{number_of_fragments: 0},
			mobile_number:{number_of_fragments: 0},
			work_number:{number_of_fragments: 0},
			sip_number:{number_of_fragments: 0},
			ip_addresses:{number_of_fragments:0}
		    }
		}
       }
         }))
        .map(
            (resp) => { 
                return (<any>resp).hits.hits;
            }
        )
        .catch(
            error => this._serverError(error)
        )
       } else {
           alert('You do not have selected any index. You must choose at least one in Settings');
           return {};
       }
    };

    public getObjectById = function (val) {
        this.id = val;
        let index = this.getAllIndices();
        if(this.obj_id!=val) {
            this.objSearchResult = Observable.fromPromise(this._client.search({
                index: index,
                body: {
                    "query": {
                        "ids": {
                            "values": [val]
                        }
                    }
                }
            }))
            this.obj_id = val;
        }
        return this.objSearchResult
        .map(
            (resp) => { 
		if ((<any>resp).hits.hits[0] != null){
                    this.ObjectService.setSearchLabel((<any>resp).hits.hits[0]._source.name);
                    this.ObjectService.emitSubjectSearch((<any>resp).hits.hits[0]._source.name);
                    this.ObjectService.emitSubject((<any>resp).hits.hits[0]._type);
		}

                return (<any>resp).hits.hits[0];
            }
        )
        .catch(this._serverError);
    };    

     public searchInInfraModel = function (val, size, more?) {
        var index = "alias_system_instance_servers";
        this.infraModelId = val;
        if(this.infra_id!=val || more)
        {
        this.infraSearchResult = Observable.fromPromise(this._client.search({
            index: index,
            body: {
                size: size,
                query: {
                    bool: {
                        should: [
                            {term: {aris_system_id: val}},
                            {term: {ngi_consists_of_id: val}},
                            {term: {ngi_depends_on_id: val}},
                            {term: {ngi_runs_on_id: val}}
                        ]
                    }
                }
            }
        }))
        this.infra_id = val;
        this.objectInf = this.getObjectById(val)
                .subscribe((item) => { this.item = item;
                });
        }
        return this.infraSearchResult
        .map(
            (resp) => { 
                this.infraTotal = resp.hits.total;
                return (<any>resp).hits.hits;
            }
        )
        .catch(this._serverError);
    };

    public searchInProdModel = function (val, size, more?) {
        var index = "alias_product_services";
        this.prodModelId = val;
        if(this.prod_id!=val || more)
        {
        this.prodSearchResult =Observable.fromPromise(this._client.search({
            index: index,
            body: {
                size: size,
                query: {
                    bool: {
                        should: [
                            {term: {service_id: val}},
                            {term: {product_id: val}}
                        ]
                    }
                }
            }
        }))
        this.prod_id=val;
        this.objectInf = this.getObjectById(val)
            .subscribe((item) => { this.item = item;
            });
        }
        return this.prodSearchResult.map(
            (resp) => { 
                this.prodTotal = resp.hits.total;
                return (<any>resp).hits.hits;
            }
        )
        .catch(this._serverError);
    };

    public searchInServModel = function (val, size, more?) {
        var index = "alias_service_process_systems";
        this.servModelId = val;
        if(this.serv_id!=val || more)
            {
            this.servSearchResult = Observable.fromPromise(this._client.search({
                index: index,
                body: {
                    size: size,
                    query: {
                        bool: {
                            should: [
                                {term: {service_id: val}},
                                {term: {process_id: val}},
                                {term: {procitf_id: val}},
                                {term: {object_id: val}}
                            ]
                        }
                    }
                }
            }))
            this.serv_id=val;
            this.objectInf = this.getObjectById(val)
                .subscribe((item) => { this.item = item;
                });
            }
        return this.servSearchResult.map(
            (resp) => { 
                this.servTotal = resp.hits.total;
                return (<any>resp).hits.hits;
            }
        )
        .catch(this._serverError);
    };

    public searchInRespModel = function (val, size, more?) {
        var index = "alias_responsibilities";
        this.respModelId = val;
        if(this.resp_id!=val || more)
            {
            this.respSearchResult = Observable.fromPromise(this._client.search({
                index: index,
                body: {
                    size: size,
                    query: {
                        bool: {
                            should: [
                                {term: {object_id: val}},
                                {term: {subject_id: val}}
                            ]
                        }
                    }
                }
            }))
            this.resp_id=val;
            this.objectInf = this.getObjectById(val)
                .subscribe((item) => { this.item = item;
                });
            }
        return this.respSearchResult.map(
            (resp) => { 
                this.respTotal = resp.hits.total;
                return (<any>resp).hits.hits;
            }
        )
         .catch(this._serverError);
    };

    public searchInBTRelModel = function (val, size, more?) {
        var index = "alias_business_term_relations";
        this.btrelModelId = val;
        if(this.btrel_id!=val || more)
            {
            this.btrelSearchResult = Observable.fromPromise(this._client.search({
                index: index,
                body: {
                    size: size,
                    query: {
                        bool: {
                            should: [
                                {term: {what_a_id: val}},
                                {term: {what_b_id: val}}
                            ]
                        }
                    }
                }
            }))
            this.btrel_id=val;
            this.objectInf = this.getObjectById(val)
                .subscribe((item) => { this.item = item;
                });
            }
        return this.btrelSearchResult.map(
            (resp) => { 
                this.btrelTotal = resp.hits.total;
                return (<any>resp).hits.hits;
            }
        )
         .catch(this._serverError);
    };
}
