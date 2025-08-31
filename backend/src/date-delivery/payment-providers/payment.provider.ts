export type PaymentProvider = {
  createPaymentIntent(input: {
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<{ clientSecret?: string; providerPaymentId?: string }>;

  confirmPayment(input: {
    providerPaymentId?: string;
  }): Promise<{ status: 'COMPLETED' | 'FAILED' | 'PROCESSING' }>;
};

export class StubPaymentProvider implements PaymentProvider {
  async createPaymentIntent(input: { amount: number; currency: string; metadata?: Record<string, any> }) {
    return {
      clientSecret: `stub_secret_${Math.random().toString(36).slice(2)}`,
      providerPaymentId: `stub_pi_${Math.random().toString(36).slice(2)}`,
    };
  }

  async confirmPayment(input: { providerPaymentId?: string }): Promise<{ status: 'COMPLETED' | 'FAILED' | 'PROCESSING' }> {
    return { status: 'COMPLETED' };
  }
}

