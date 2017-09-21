import {Injectable, EventEmitter} from "@angular/core";
import {
    Http, Headers, Response, RequestOptionsArgs, RequestOptions,
    XHRBackend
} from "@angular/http";
import {Observable} from "rxjs";
//import {ShellService} from "./shell.service";
//import {AppState} from "../../app.service";
import {KeycloakService} from "./keycloak.service";
//import {InterruptSource, InterruptArgs} from "@ng-idle/core";

//const DO_NOT_SHOW_ERRORS_FOR: RegExp[] = [
//    /api\/clients\?q=*/,
//    /api\/validations*/,
//    /logs*/,
//    /api\/users\/info\/*/
//]

//const DO_NOT_SHOW_PROGRESS_FOR: RegExp[] = [
//    /api\/users\/info*/,
//    /api\/users\/notifications*/
//]

@Injectable()
export class CustomHttp extends Http {

    constructor(_backend: XHRBackend, _defaultOptions: RequestOptions, private keycloak: KeycloakService) {
        super(_backend, _defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        console.log("GET");
        options = options || {};
        return this.getHeaders()
            .flatMap(headers => {
                options.headers = headers;
                return super.get(url, options);
            })
    }

    request(url: string, options?: RequestOptionsArgs): Observable<Response> {
        console.log("GET");
        options = options || {};
        return this.getHeaders()
            .flatMap(headers => {
                options.headers = headers;
                return super.get(url, options);
            })
    }

    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        console.log("POST");
        options = options || {};
        return this.getHeaders()
            .flatMap(headers => {
                options.headers = headers;
                return super.post(url, body, options);
            })
    }

    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        console.log("PUT");
        options = options || {};
        return this.getHeaders()
            .flatMap(headers => {
                options.headers = headers;
                return super.put(url, body, options);
            })
    }

    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        console.log("DELETE");
        options = options || {};
        return this.getHeaders()
            .flatMap(headers => {
                options.headers = headers;
                return super.delete(url, options);
            })
    }

    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        console.log("POST");
        options = options || {};
        return this.getHeaders()
            .flatMap(headers => {
                options.headers = headers;
                return super.patch(url, body, options);
            })
    }

    getHeaders(): Observable<Headers> {
        let headers = new Headers();
        return Observable.fromPromise(this.keycloak.getToken())
            .flatMap(token => {
                // headers.append('Accept', 'application/json');
                // headers.append('Access-Control-Allow-Origin', '*');
                // headers.append('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Content-Type, Accept, Authorization, If-Modified-Since, Cache-Control, Pragma');
                // headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
                headers.set('Authorization', 'Bearer ' + token)
                return Observable.of(headers);
            });
    }
}


/*
@Injectable()
export class HttpService extends InterruptSource {
    _apiEndpoint = API_URL;
    activeRequests = 0;
    onActiveRequestChanged: EventEmitter<number> = new EventEmitter();

    constructor(private _http: Http, private app: AppState) {
        super(null, null);
        this.onInterrupt = new EventEmitter<InterruptArgs>();
    }

    _getApiUrl(resource: string) {
        return `${this._apiEndpoint}/${resource}`;
    }

    ping() {
        this.get('health/ping')
            .subscribe();
    }

    isProgressInSilentList(url: string) {
        return DO_NOT_SHOW_PROGRESS_FOR.some(regex => {
            return regex.test(url);
        })
    }

    iterceptRequest(url): Observable<any> {
        return Observable.of(url)
            .map(() => {
                if (!this.isProgressInSilentList(url)) {
                    this.activeRequests++
                }
                this.onInterrupt.emit(new InterruptArgs(this, {}));
                this.onActiveRequestChanged.next(this.activeRequests);
            });
    }

    iterceptResponse(url) {
        if (!this.isProgressInSilentList(url)) {
            this.activeRequests--
        }
        this.onActiveRequestChanged.next(this.activeRequests);
    }

    getRaw(resource: string): Observable<any> {
        let url = this._getApiUrl(resource);
        return this.iterceptRequest(url)
            .flatMap(() => {
                return this._http.get(url)
            })
            .catch(error => {
                return this.doOnError(url, error)
            })
            .finally(() => {
                this.iterceptResponse(url);
            });
    }

    get(resource: string): Observable<any> {
        let url = this._getApiUrl(resource);
        return this.iterceptRequest(url)
            .flatMap(() => {
                return this._http.get(url)
            })
            .map(response => response.json())
            .catch(error => {
                return this.doOnError(url, error)
            }).finally(() => {
                this.iterceptResponse(url);
            });

    }

    post(resource: string, data: any): Observable<any> {
        let url = this._getApiUrl(resource);
        return this.iterceptRequest(url)
            .flatMap(() => this._http.post(url, data))
            .map(response => response.json())
            .catch(error => {
                return this.doOnError(url, error)
            }).finally(() => {
                this.iterceptResponse(url);
            });
        ;
    }

    put(resource: string, data: any): Observable<any> {
        let url = this._getApiUrl(resource);
        return this.iterceptRequest(url)
            .flatMap(() => this._http.put(url, data))
            .map(response => response.json())
            .catch(error => {
                return this.doOnError(url, error)
            }).finally(() => {
                this.iterceptResponse(url);
            });
        ;
    }

    delete(resource: string): Observable<any> {
        let url = this._getApiUrl(resource);
        return this.iterceptRequest(url)
            .flatMap(() => this._http.delete(url))
            .map(response => response.json())
            .catch(error => {
                return this.doOnError(url, error)
            })
            .finally(() => {
                this.iterceptResponse(url);
            });
        ;
    }

    isApiCallInSilentList(url: string) {
        return DO_NOT_SHOW_ERRORS_FOR.some(regex => {
            return regex.test(url);
        })
    }

    private doOnError(url, error): Observable<any> {
        if (this.isApiCallInSilentList(url)) {
            // return Observable.throw(error || 'backend server error');
            return Observable.of(error);
        }
        this.app.onApiError.next(error);
        if (error instanceof Response) {
            return Observable.throw(error.json().error || 'backend server error');
        }
        return Observable.throw(error || 'backend server error');
    }
}
*/
