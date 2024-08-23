import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRangoComponent } from './reporte-rango.component';

describe('ReporteRangoComponent', () => {
  let component: ReporteRangoComponent;
  let fixture: ComponentFixture<ReporteRangoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteRangoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteRangoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
