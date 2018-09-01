"use strict";
var testing_1 = require('@angular/core/testing');
var completed_doc_component_1 = require('./completed-doc.component');
describe('CompletedDocComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [completed_doc_component_1.CompletedDocComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(completed_doc_component_1.CompletedDocComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
