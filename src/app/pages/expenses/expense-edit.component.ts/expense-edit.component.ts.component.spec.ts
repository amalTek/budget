import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseEditComponentTsComponent } from './expense-edit.component.ts.component';

describe('ExpenseEditComponentTsComponent', () => {
  let component: ExpenseEditComponentTsComponent;
  let fixture: ComponentFixture<ExpenseEditComponentTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseEditComponentTsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseEditComponentTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
