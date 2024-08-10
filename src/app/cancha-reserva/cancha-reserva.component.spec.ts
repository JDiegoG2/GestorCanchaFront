import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanchaReservaComponent } from './cancha-reserva.component';

describe('CanchaReservaComponent', () => {
  let component: CanchaReservaComponent;
  let fixture: ComponentFixture<CanchaReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanchaReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchaReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
