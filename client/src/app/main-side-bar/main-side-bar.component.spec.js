"use strict";
var testing_1 = require('@angular/core/testing');
var main_side_bar_component_1 = require('./main-side-bar.component');
describe('MainSideBarComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [main_side_bar_component_1.MainSideBarComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(main_side_bar_component_1.MainSideBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
