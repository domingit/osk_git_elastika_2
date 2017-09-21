import {Component, Input} from '@angular/core';
import { ObjectService } from "templates/object.service";

@Component({
  selector: 'profile-body',
  templateUrl: './profile_body.component.html'
})
export class ProfBodyComponent {
  signedIn: any;
  page: any;
  auth: any;
  user: any;

  constructor(private service: ObjectService){
    this.signedIn = this.service.signedIn;
    this.page=this.service.account_url;
    this.service.auth$.subscribe(
                (auth) => {this.auth = auth;
                  if (auth.authz) {
                  this.user=auth.authz.idTokenParsed;
                  this.signedIn = auth.loggedIn;
                  }
                }
            );
  }

  private accountInfo(): any {
    this.service.navigateToOutPage('account');
  }

}