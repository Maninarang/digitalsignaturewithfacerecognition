"use strict";
var testing_1 = require('@angular/core/testing');
var pending_doc_component_1 = require('./pending-doc.component');
describe('PendingDocComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [pending_doc_component_1.PendingDocComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(pending_doc_component_1.PendingDocComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
