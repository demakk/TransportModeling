import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageMainPartComponent } from './user-page-main-part.component';

describe('UserPageMainPartComponent', () => {
  let component: UserPageMainPartComponent;
  let fixture: ComponentFixture<UserPageMainPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageMainPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPageMainPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
