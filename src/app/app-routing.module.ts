import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ObjectInfoComponent }  from '../templates/object_info.component';
import {ObjectServiceComponent} from '../templates/object_in_service.component';
import {ObjectResponsibilityComponent} from '../templates/object_in_responsibility.component';
import {ObjectBTRelationComponent} from '../templates/object_in_btrelation.component';
import {ObjectProductComponent} from '../templates/object_in_product.component';
import {ObjectInfrastructureComponent} from '../templates/object_in_infrastructure.component';
import {ObjectBodyComponent} from '../templates/object.component';
import {ObjectMainBodyComponent} from '../templates/object_main.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full'},
  { path: 'main',component: ObjectMainBodyComponent},
  { path: 'object/info',component: ObjectInfoComponent},
  { path: 'object/servmodel',component: ObjectServiceComponent},
  { path: 'object/respmodel',component: ObjectResponsibilityComponent},
  { path: 'object/btrelmodel',component: ObjectBTRelationComponent},
  { path: 'object/prodmodel',component: ObjectProductComponent},
  { path: 'object/inframodel',component: ObjectInfrastructureComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
