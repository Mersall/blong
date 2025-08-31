import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const WEIGHTS = {
  personality: 0.4,
  preference: 0.3,
  value: 0.2,
  interaction: 0.1,
};

@Injectable()
export class MatchingService {
  constructor(private readonly prisma: PrismaService) {}

  private computePersonalityScore(a: any, b: any): number {
    const traits = ['openness_score','conscientiousness_score','extraversion_score','agreeableness_score','neuroticism_score'];
    let score = 0;
    let count = 0;
    for (const t of traits) {
      if (a?.[t] != null && b?.[t] != null) {
        const diff = Math.abs((a[t] as number) - (b[t] as number));
        score += Math.max(0, 100 - diff);
        count++;
      }
    }
    return count ? score / count : 0;
  }

  private computePreferenceScore(aPrefs: any, bPrefs: any): number {
    // Simple placeholder: if both exist, return 80; else 0
    if (aPrefs && bPrefs) return 80;
    return 0;
  }

  private computeValueScore(a: any, b: any): number {
    // Placeholder for values alignment (religion/family values/goals)
    return 70;
  }

  private computeInteractionScore(history: any): number {
    // Placeholder using interaction history
    return 60;
  }

  private computeCompatibility(aProfile: any, bProfile: any, aPrefs: any, bPrefs: any, interactionHistory?: any) {
    const personality = this.computePersonalityScore(aProfile, bProfile);
    const preference = this.computePreferenceScore(aPrefs, bPrefs);
    const value = this.computeValueScore(aProfile, bProfile);
    const interaction = this.computeInteractionScore(interactionHistory);

    const total = personality * WEIGHTS.personality
      + preference * WEIGHTS.preference
      + value * WEIGHTS.value
      + interaction * WEIGHTS.interaction;

    return { total, breakdown: { personality, preference, value, interaction } };
  }

  async getMatches(userId: string, { page = 1, limit = 10 }: { page?: number; limit?: number }) {
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      where: { id: { not: userId } },
      select: { id: true },
      skip,
      take: limit,
    });

    const currentProfile = await this.prisma.userPersonalityProfile.findUnique({ where: { user_id: userId } });

    const results = await Promise.all(users.map(async (u) => {
      const otherProfile = await this.prisma.userPersonalityProfile.findUnique({ where: { user_id: u.id } });
      const score = this.computeCompatibility(currentProfile, otherProfile, null, null);
      return { id: u.id, score: Math.round(score.total), breakdown: score.breakdown };
    }));

    const filtered = results.filter(r => r.score >= 75);

    return { success: true, data: { matches: filtered, pagination: { page, limit } }, message: 'Matches retrieved successfully' };
  }

  async getMatchById(userId: string, id: string) {
    const currentProfile = await this.prisma.userPersonalityProfile.findUnique({ where: { user_id: userId } });
    const otherProfile = await this.prisma.userPersonalityProfile.findUnique({ where: { user_id: id } });
    if (!otherProfile) throw new NotFoundException('Match target not found');

    const score = this.computeCompatibility(currentProfile, otherProfile, null, null);
    return { success: true, data: { userId: id, score: Math.round(score.total), breakdown: score.breakdown } };
  }
}

