const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyTestUser() {
  try {
    const user = await prisma.user.updateMany({
      where: {
        email: 'test@blong.app'
      },
      data: {
        isVerified: true,
        verificationStatus: 'VERIFIED',
        verificationToken: null,
        verificationTokenExpiry: null
      }
    });

    console.log('✅ Test user verified:', user);
  } catch (error) {
    console.error('❌ Error verifying test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTestUser();