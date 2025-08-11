/**
 * BLONG Error Processing Service Tests
 * Test the enhanced error handling system
 */

import ErrorProcessingService from '../errorProcessingService';
import { ERROR_TYPES, ERROR_SEVERITY } from '../../utils/errorHandling';

describe('ErrorProcessingService', () => {
  describe('processError', () => {
    it('should process network errors with context', () => {
      const error = new Error('Network request failed');
      error.code = 'NETWORK_ERROR';
      
      const context = {
        operation: 'profile_save',
        screen: 'ProfileCompletion',
        userId: 'test-user-123'
      };
      
      const result = ErrorProcessingService.processError(error, context);
      
      expect(result.type).toBe(ERROR_TYPES.NETWORK);
      expect(result.userAction).toBe('profile_save');
      expect(result.screenName).toBe('ProfileCompletion');
      expect(result.userId).toBe('test-user-123');
      expect(result.recoverySteps).toBeDefined();
      expect(result.estimatedResolutionTime).toBeDefined();
    });

    it('should add BLONG-specific error patterns', () => {
      const error = new Error('PROFILE_INCOMPLETE');
      
      const result = ErrorProcessingService.processError(error);
      
      expect(result.type).toBe(ERROR_TYPES.VALIDATION);
      expect(result.title).toBe('Profile Incomplete');
      expect(result.suggestions).toContain('Fill in all required profile fields');
    });

    it('should enhance errors with context-aware messaging', () => {
      const error = new Error('Network request failed');
      error.code = 'NETWORK_ERROR';
      
      const context = { operation: 'quiz_submission' };
      
      const result = ErrorProcessingService.processError(error, context);
      
      expect(result.message).toContain('quiz answers couldn\'t be submitted');
      expect(result.suggestions).toContain('Your answers are saved locally');
    });
  });

  describe('getModalConfig', () => {
    it('should provide BLONG-specific custom actions', () => {
      const processedError = {
        type: ERROR_TYPES.QUIZ,
        title: 'Quiz Error',
        message: 'Quiz session expired',
        suggestions: ['Resume from where you left off'],
        retryable: true
      };
      
      const config = ErrorProcessingService.getModalConfig(processedError);
      
      expect(config.customActions).toBeDefined();
      expect(config.customActions[0].label).toBe('Resume Quiz');
      expect(config.customActions[0].icon).toBe('play-circle');
    });

    it('should include suggestions in modal config', () => {
      const processedError = {
        type: ERROR_TYPES.VALIDATION,
        title: 'Validation Error',
        message: 'Invalid data',
        suggestions: ['Check your input', 'Try again'],
        retryable: false
      };
      
      const config = ErrorProcessingService.getModalConfig(processedError);
      
      expect(config.suggestions).toEqual(['Check your input', 'Try again']);
    });
  });

  describe('addRecoveryGuidance', () => {
    it('should add recovery steps for network errors', () => {
      const errorInfo = {
        type: ERROR_TYPES.NETWORK,
        context: { operation: 'profile_save' }
      };
      
      const result = ErrorProcessingService.addRecoveryGuidance(errorInfo);
      
      expect(result.recoverySteps).toBeDefined();
      expect(result.recoverySteps.length).toBeGreaterThan(0);
      expect(result.recoverySteps[0]).toContain('Check your WiFi');
      expect(result.estimatedResolutionTime).toBe('Usually resolves in 1-2 minutes');
    });

    it('should add recovery steps for validation errors', () => {
      const errorInfo = {
        type: ERROR_TYPES.VALIDATION,
        context: { operation: 'profile_save' }
      };
      
      const result = ErrorProcessingService.addRecoveryGuidance(errorInfo);
      
      expect(result.recoverySteps).toBeDefined();
      expect(result.recoverySteps[0]).toContain('Review all highlighted fields');
      expect(result.estimatedResolutionTime).toBe('Can be fixed immediately');
    });
  });

  describe('generateErrorReport', () => {
    it('should generate comprehensive error report', () => {
      const processedError = {
        timestamp: '2024-01-01T00:00:00.000Z',
        type: ERROR_TYPES.NETWORK,
        severity: ERROR_SEVERITY.HIGH,
        userAction: 'profile_save',
        screenName: 'ProfileCompletion',
        platform: 'ios',
        title: 'Network Error',
        message: 'Connection failed',
        technical: { status: 500 },
        context: { userId: 'test-123' }
      };
      
      const report = ErrorProcessingService.generateErrorReport(processedError);
      
      expect(report.errorId).toMatch(/^BLONG_\d+_[a-z0-9]+$/);
      expect(report.timestamp).toBe('2024-01-01T00:00:00.000Z');
      expect(report.type).toBe(ERROR_TYPES.NETWORK);
      expect(report.operation).toBe('profile_save');
      expect(report.errorDetails).toBeDefined();
      expect(report.deviceInfo).toBeDefined();
    });
  });
});
