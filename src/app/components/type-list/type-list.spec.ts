import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeList } from './type-list/type-list';

describe('TypeList', () => {
  let component: TypeList;
  let fixture: ComponentFixture<TypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeList],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
