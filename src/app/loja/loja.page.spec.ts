import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LojaPage } from './loja.page';

describe('LojaPage', () => {
  let component: LojaPage;
  let fixture: ComponentFixture<LojaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LojaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
