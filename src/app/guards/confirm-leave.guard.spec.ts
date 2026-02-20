import { TestBed } from '@angular/core/testing';
import { ConfirmLeaveGuard, CanComponentDeactivate } from './confirm-leave.guard';

describe('ConfirmLeaveGuard', () => {
  let guard: ConfirmLeaveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmLeaveGuard]
    });

    guard = TestBed.inject(ConfirmLeaveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canDeactivate', () => {
    const mockCurrentRoute: any = {};
    const mockCurrentState: any = {};
    const mockNextState: any = {};

    it('should return true when component allows deactivation', () => {
      const mockComponent: CanComponentDeactivate = {
        canDeactivate: () => true
      };

      const result = guard.canDeactivate(
        mockComponent,
        mockCurrentRoute,
        mockCurrentState,
        mockNextState
      );

      expect(result).toBe(true);
    });

    it('should return false when component prevents deactivation', () => {
      const mockComponent: CanComponentDeactivate = {
        canDeactivate: () => false
      };

      const result = guard.canDeactivate(
        mockComponent,
        mockCurrentRoute,
        mockCurrentState,
        mockNextState
      );

      expect(result).toBe(false);
    });

    it('should return true when component has no canDeactivate method', () => {
      const mockComponent: any = {};

      const result = guard.canDeactivate(
        mockComponent,
        mockCurrentRoute,
        mockCurrentState,
        mockNextState
      );

      expect(result).toBe(true);
    });

    it('should call component canDeactivate method', () => {
      const mockComponent: CanComponentDeactivate = {
        canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(true)
      };

      guard.canDeactivate(
        mockComponent,
        mockCurrentRoute,
        mockCurrentState,
        mockNextState
      );

      expect(mockComponent.canDeactivate).toHaveBeenCalled();
    });

    it('should handle Promise return from component', async () => {
      const mockComponent: CanComponentDeactivate = {
        canDeactivate: () => Promise.resolve(true)
      };

      const result = guard.canDeactivate(
        mockComponent,
        mockCurrentRoute,
        mockCurrentState,
        mockNextState
      );

      expect(result instanceof Promise).toBe(true);
      expect(await result).toBe(true);
    });

    it('should handle Promise rejection from component', async () => {
      const mockComponent: CanComponentDeactivate = {
        canDeactivate: () => Promise.resolve(false)
      };

      const result = guard.canDeactivate(
        mockComponent,
        mockCurrentRoute,
        mockCurrentState,
        mockNextState
      );

      expect(await result).toBe(false);
    });
  });
});
