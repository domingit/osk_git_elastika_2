import { Injectable } from '@angular/core';

declare var Keycloak: any;

@Injectable()
export class KeycloakService {
  static auth: any = {};
  static redirectUrl = "localhost:4444";

  static init(): Promise<any> {
    //let keycloakAuth: any = new Keycloak('keycloak.json');
    let keycloakAuth: any = new Keycloak('assets/keycloak.json');
    KeycloakService.auth.loggedIn = false;

      return new Promise((resolve, reject) => {
        //keycloakAuth.init({ onLoad: 'login-required' })

        keycloakAuth.onAuthSuccess = function () {
        console.log('*** AUTH SUCCESS');
        };

        keycloakAuth.onAuthError = function (errorData) {
            console.log('*** AUTH ERROR');
        };

        keycloakAuth.onAuthRefreshSuccess = function () {
          console.log('*** AUTH REFRESH SUCCESS');
        };

        keycloakAuth.onAuthRefreshError = function () {
            console.log('*** AUTH REFRESH ERROR');
        };

        keycloakAuth.onAuthLogout = function () {
            console.log('*** LOGOUT');
        };

        keycloakAuth.onTokenExpired = function () {
            console.log('*** TOKEN EXPIRED');
        };

        keycloakAuth.init({ responseMode: 'fragment',
                            flow: 'standard',
                            onLoad: 'login-required',
                            checkLoginIframeInterval: 30 })
          .success(() => {
            KeycloakService.auth.loggedIn = true;
            KeycloakService.auth.authz = keycloakAuth;
            KeycloakService.auth.logoutUrl = this.redirectUrl;
            resolve();
          })
          .error(() => {
            reject();
          });
      });
    }

  logout() {
    console.log('*** LOGOUT');
    KeycloakService.auth.loggedIn = false;
    KeycloakService.auth.authz = null;

    window.location.href = KeycloakService.auth.logoutUrl;
  }

  signOut(logOutUrl) {
    console.log('*** signOut');
    KeycloakService.auth.authz.logout(logOutUrl);
    KeycloakService.auth.loggedIn = false;
    KeycloakService.auth.authz = null;

    //window.location.href = KeycloakService.auth.logoutUrl;
  }

  getUserInfo() {
    return KeycloakService.auth;
  }

  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (KeycloakService.auth.authz.token) {
        KeycloakService.auth.authz.updateToken(5)
          .success(() => {
            resolve(<string>KeycloakService.auth.authz.token);
          })
          .error(() => {
            reject('Failed to refresh token');
          });
      }
    });
  }
}