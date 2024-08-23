import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDiaComponent } from './reporte-dia.component';

describe('ReporteDiaComponent', () => {
  let component: ReporteDiaComponent;
  let fixture: ComponentFixture<ReporteDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
