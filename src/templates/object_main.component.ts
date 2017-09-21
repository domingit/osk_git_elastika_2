import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ObjectService } from "templates/object.service";

@Component({
    selector: 'main-body',
    templateUrl: './object_main.component.html'
})

export class ObjectMainBodyComponent{
    private head_title:string;
    isIn = false;   // store state


    isFirstTimeOpened = true;
    constructor(private objectService: ObjectService){
    }

    public getSearchLabel(): boolean {
        return this.objectService.getSearchLabel();
    }

}