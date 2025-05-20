import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicModelingComponent } from './economic-modeling.component';

describe('EconomicModelingComponent', () => {
  let component: EconomicModelingComponent;
  let fixture: ComponentFixture<EconomicModelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicModelingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicModelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
