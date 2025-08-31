import { Test, TestingModule } from '@nestjs/testing';
import { DateDeliveryService } from './date-delivery.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';

describe('DateDeliveryService - Payments', () => {
  let service: DateDeliveryService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = () => ({
    date_payments: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  }) as any as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DateDeliveryService,
        { provide: PrismaService, useFactory: mockPrisma },
        { provide: AppConfigService, useValue: { paymentProvider: 'STUB' } },
      ],
    }).compile();

    service = module.get<DateDeliveryService>(DateDeliveryService);
    prisma = module.get(PrismaService) as any;
  });

  describe('createPayment', () => {
    it('should create a new pending payment when none exists', async () => {
      (prisma.date_payments.findFirst as any).mockResolvedValue(null as any);
      (prisma.date_payments.create as any).mockResolvedValue({
        id: 'pay_1',
        deliveredDateId: 'deliv_1',
        userId: 'user_1',
        amount: 49.99,
        currency: 'USD',
        status: 'PENDING',
      } as any);

      const res = await service.createPayment('user_1', {
        deliveredDateId: 'deliv_1',
        amount: 49.99,
      });

      expect(prisma.date_payments.findFirst).toHaveBeenCalledWith({
        where: { deliveredDateId: 'deliv_1', userId: 'user_1', status: { in: ['PENDING', 'PROCESSING'] } },
      });
      expect(prisma.date_payments.create).toHaveBeenCalled();
      expect(res).toMatchObject({ success: true, data: { status: 'PENDING' } });
    });

    it('should return existing pending/processing payment (idempotent)', async () => {
      (prisma.date_payments.findFirst as any).mockResolvedValue({ id: 'pay_existing', status: 'PENDING' } as any);

      const res = await service.createPayment('user_1', {
        deliveredDateId: 'deliv_1',
        amount: 20,
      });

      expect(prisma.date_payments.create).not.toHaveBeenCalled();
      expect(res).toMatchObject({ success: true, data: { id: 'pay_existing' } });
    });
  });

  describe('confirmPayment', () => {
    it('should update payment to COMPLETED', async () => {
      (prisma.date_payments.findUnique as any).mockResolvedValue({
        id: 'pay_1',
        deliveredDateId: 'deliv_1',
        userId: 'user_1',
        status: 'PENDING',
      } as any);

      (prisma.date_payments.update as any).mockResolvedValue({
        id: 'pay_1',
        status: 'COMPLETED',
        paidAt: new Date(),
      } as any);

      const res = await service.confirmPayment('user_1', {
        deliveredDateId: 'deliv_1',
        paymentIntentId: 'pi_123',
      });

      expect(prisma.date_payments.findUnique).toHaveBeenCalledWith({
        where: { deliveredDateId_userId: { deliveredDateId: 'deliv_1', userId: 'user_1' } },
      });
      expect(prisma.date_payments.update).toHaveBeenCalled();
      expect(res).toMatchObject({ success: true, data: { status: 'COMPLETED' } });
    });

    it('should return early if already COMPLETED', async () => {
      const payment = { id: 'pay_1', status: 'COMPLETED' } as any;
      (prisma.date_payments.findUnique as any).mockResolvedValue(payment);

      const res = await service.confirmPayment('user_1', { deliveredDateId: 'deliv_1' });
      expect(res).toMatchObject({ success: true, data: payment });
      expect(prisma.date_payments.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when payment not found', async () => {
      (prisma.date_payments.findUnique as any).mockResolvedValue(null as any);
      await expect(
        service.confirmPayment('user_1', { deliveredDateId: 'missing' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

