import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportLoadComponent } from './transport-load.component';

describe('TransportLoadComponent', () => {
  let component: TransportLoadComponent;
  let fixture: ComponentFixture<TransportLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportLoadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
