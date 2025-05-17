import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingDialogComponent } from './invoicing-dialog.component';

describe('InvoicingDialogComponent', () => {
  let component: InvoicingDialogComponent;
  let fixture: ComponentFixture<InvoicingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
