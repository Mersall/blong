/**
 * JWT service mock for testing
 */

import { JwtService } from '@nestjs/jwt';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type JwtServiceMock = DeepMockProxy<JwtService>;

export const createJwtServiceMock = (): JwtServiceMock => {
  const mock = mockDeep<JwtService>();
  
  // Default implementations
  mock.signAsync.mockImplementation(async (payload: any) => {
    return `mock-token-${payload.sub || 'unknown'}`;
  });
  
  mock.sign.mockImplementation((payload: any) => {
    return `mock-token-${payload.sub || 'unknown'}`;
  });
  
  mock.verify.mockImplementation((token: string) => {
    const userId = token.replace('mock-token-', '');
    return {
      sub: userId,
      email: 'test@example.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
  });
  
  mock.verifyAsync.mockImplementation(async (token: string) => {
    return mock.verify(token);
  });
  
  return mock;
};

export const jwtServiceMock = createJwtServiceMock();