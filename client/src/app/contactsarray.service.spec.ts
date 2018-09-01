import { TestBed, inject } from '@angular/core/testing';

import { ContactsarrayService } from './contactsarray.service';

describe('ContactsarrayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactsarrayService]
    });
  });

  it('should be created', inject([ContactsarrayService], (service: ContactsarrayService) => {
    expect(service).toBeTruthy();
  }));
});
