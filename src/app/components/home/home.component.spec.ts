import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('title and subtitle', () => {
    it('should have a title', () => {
      expect(component.title).toBeTruthy();
    });

    it('should have correct title text', () => {
      expect(component.title).toBe('Angular Demo Application');
    });

    it('should have a subtitle', () => {
      expect(component.subtitle).toBeTruthy();
    });
  });

  describe('demoSections', () => {
    it('should have demo sections array', () => {
      expect(component.demoSections).toBeTruthy();
      expect(Array.isArray(component.demoSections)).toBe(true);
    });

    it('should have 5 demo sections', () => {
      expect(component.demoSections.length).toBe(5);
    });

    it('should have Routing section', () => {
      const routing = component.demoSections.find(s => s.title === 'Routing');
      expect(routing).toBeTruthy();
      expect(routing?.features.length).toBeGreaterThan(0);
    });

    it('should have Forms section', () => {
      const forms = component.demoSections.find(s => s.title === 'Forms');
      expect(forms).toBeTruthy();
      expect(forms?.route).toBe('/forms');
    });

    it('should have Unit Testing section', () => {
      const testing = component.demoSections.find(s => s.title === 'Unit Testing');
      expect(testing).toBeTruthy();
    });

    it('should have Services & RxJS section', () => {
      const services = component.demoSections.find(s => s.title === 'Services & RxJS');
      expect(services).toBeTruthy();
      expect(services?.route).toBe('/services');
    });

    it('should have Configuration section', () => {
      const config = component.demoSections.find(s => s.title === 'Configuration');
      expect(config).toBeTruthy();
    });

    it('should have features with code references', () => {
      component.demoSections.forEach(section => {
        section.features.forEach(feature => {
          expect(feature.name).toBeTruthy();
          expect(feature.codeRef).toBeTruthy();
        });
      });
    });
  });

  describe('quickLinks', () => {
    it('should have quick links array', () => {
      expect(component.quickLinks).toBeTruthy();
      expect(Array.isArray(component.quickLinks)).toBe(true);
    });

    it('should have multiple quick links', () => {
      expect(component.quickLinks.length).toBeGreaterThan(0);
    });

    it('should have links with routes', () => {
      component.quickLinks.forEach(link => {
        expect(link.label).toBeTruthy();
        expect(link.route).toBeTruthy();
      });
    });
  });

  describe('testCommands', () => {
    it('should have test commands array', () => {
      expect(component.testCommands).toBeTruthy();
      expect(Array.isArray(component.testCommands)).toBe(true);
    });

    it('should include ng test command', () => {
      const ngTest = component.testCommands.find(c => c.command === 'ng test');
      expect(ngTest).toBeTruthy();
    });

    it('should include ng build command', () => {
      const ngBuild = component.testCommands.find(c => c.command === 'ng build');
      expect(ngBuild).toBeTruthy();
    });
  });

  describe('template rendering', () => {
    it('should render title in the template', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Angular Demo Application');
    });

    it('should render demo section cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const cards = compiled.querySelectorAll('.card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
