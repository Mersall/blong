/**
 * BLONG Phase Management Service
 * Handles phase transitions, progress tracking, and data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './apiService';

const STORAGE_KEYS = {
  CURRENT_PHASE: '@blong_current_phase',
  PHASE_PROGRESS: '@blong_phase_progress',
  PHASE_MILESTONES: '@blong_phase_milestones',
  PHASE_HISTORY: '@blong_phase_history',
};

export class PhaseManagementService {
  constructor() {
    this.currentPhase = null;
    this.phaseProgress = {};
    this.milestones = [];
    this.phaseHistory = [];
  }

  /**
   * Initialize phase management system
   */
  async initialize(userId) {
    try {
      await this.loadPhaseData();
      
      // Sync with server if authenticated
      if (userId) {
        await this.syncWithServer(userId);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize phase management:', error);
      return false;
    }
  }

  /**
   * Load phase data from local storage
   */
  async loadPhaseData() {
    try {
      const [currentPhase, progress, milestones, history] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PHASE),
        AsyncStorage.getItem(STORAGE_KEYS.PHASE_PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.PHASE_MILESTONES),
        AsyncStorage.getItem(STORAGE_KEYS.PHASE_HISTORY),
      ]);

      this.currentPhase = currentPhase ? JSON.parse(currentPhase) : null;
      this.phaseProgress = progress ? JSON.parse(progress) : {};
      this.milestones = milestones ? JSON.parse(milestones) : [];
      this.phaseHistory = history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to load phase data:', error);
      // Initialize with defaults
      this.currentPhase = null;
      this.phaseProgress = {};
      this.milestones = [];
      this.phaseHistory = [];
    }
  }

  /**
   * Save phase data to local storage
   */
  async savePhaseData() {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PHASE, JSON.stringify(this.currentPhase)),
        AsyncStorage.setItem(STORAGE_KEYS.PHASE_PROGRESS, JSON.stringify(this.phaseProgress)),
        AsyncStorage.setItem(STORAGE_KEYS.PHASE_MILESTONES, JSON.stringify(this.milestones)),
        AsyncStorage.setItem(STORAGE_KEYS.PHASE_HISTORY, JSON.stringify(this.phaseHistory)),
      ]);
    } catch (error) {
      console.error('Failed to save phase data:', error);
      throw error;
    }
  }

  /**
   * Sync phase data with server
   */
  async syncWithServer(userId) {
    try {
      // Get server data
      const response = await apiService.get(`/users/${userId}/phase-data`);
      const serverData = response.data;

      // Compare and merge data
      if (serverData.currentPhase && 
          (!this.currentPhase || new Date(serverData.updatedAt) > new Date(this.currentPhase.updatedAt))) {
        this.currentPhase = serverData.currentPhase;
      }

      if (serverData.progress) {
        this.phaseProgress = { ...this.phaseProgress, ...serverData.progress };
      }

      if (serverData.milestones) {
        this.milestones = this.mergeMilestones(this.milestones, serverData.milestones);
      }

      // Save merged data locally
      await this.savePhaseData();

      // Push local changes to server
      await this.pushToServer(userId);
    } catch (error) {
      console.error('Failed to sync with server:', error);
      // Continue with local data
    }
  }

  /**
   * Push local phase data to server
   */
  async pushToServer(userId) {
    try {
      const data = {
        currentPhase: this.currentPhase,
        progress: this.phaseProgress,
        milestones: this.milestones,
        history: this.phaseHistory,
        updatedAt: new Date().toISOString(),
      };

      await apiService.put(`/users/${userId}/phase-data`, data);
    } catch (error) {
      console.error('Failed to push phase data to server:', error);
      // Don't throw - local data is still valid
    }
  }

  /**
   * Get current phase information
   */
  getCurrentPhase() {
    return this.currentPhase;
  }

  /**
   * Set current phase
   */
  async setCurrentPhase(phase, userId = null) {
    try {
      const previousPhase = this.currentPhase;
      
      this.currentPhase = {
        ...phase,
        setAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to history
      if (previousPhase) {
        this.phaseHistory.push({
          phase: previousPhase,
          transitionedAt: new Date().toISOString(),
          duration: new Date() - new Date(previousPhase.setAt),
        });
      }

      // Initialize progress for new phase
      if (!this.phaseProgress[phase.id]) {
        this.phaseProgress[phase.id] = {
          percentage: 0,
          startedAt: new Date().toISOString(),
          milestones: [],
        };
      }

      await this.savePhaseData();

      // Sync with server if authenticated
      if (userId) {
        await this.pushToServer(userId);
      }

      return true;
    } catch (error) {
      console.error('Failed to set current phase:', error);
      return false;
    }
  }

  /**
   * Update phase progress
   */
  async updateProgress(phaseId, percentage, userId = null) {
    try {
      if (!this.phaseProgress[phaseId]) {
        this.phaseProgress[phaseId] = {
          percentage: 0,
          startedAt: new Date().toISOString(),
          milestones: [],
        };
      }

      this.phaseProgress[phaseId].percentage = Math.min(Math.max(percentage, 0), 100);
      this.phaseProgress[phaseId].updatedAt = new Date().toISOString();

      await this.savePhaseData();

      // Sync with server if authenticated
      if (userId) {
        await this.pushToServer(userId);
      }

      return true;
    } catch (error) {
      console.error('Failed to update progress:', error);
      return false;
    }
  }

  /**
   * Get phase progress
   */
  getProgress(phaseId) {
    return this.phaseProgress[phaseId] || { percentage: 0, milestones: [] };
  }

  /**
   * Complete milestone
   */
  async completeMilestone(milestoneId, phaseId, userId = null) {
    try {
      const existingIndex = this.milestones.findIndex(m => m.id === milestoneId);
      
      if (existingIndex >= 0) {
        this.milestones[existingIndex] = {
          ...this.milestones[existingIndex],
          completed: true,
          completedAt: new Date().toISOString(),
        };
      } else {
        this.milestones.push({
          id: milestoneId,
          phaseId,
          completed: true,
          completedAt: new Date().toISOString(),
        });
      }

      // Update phase progress based on completed milestones
      await this.recalculatePhaseProgress(phaseId);

      await this.savePhaseData();

      // Sync with server if authenticated
      if (userId) {
        await this.pushToServer(userId);
      }

      return true;
    } catch (error) {
      console.error('Failed to complete milestone:', error);
      return false;
    }
  }

  /**
   * Get milestones for a phase
   */
  getMilestones(phaseId = null) {
    if (phaseId) {
      return this.milestones.filter(m => m.phaseId === phaseId);
    }
    return this.milestones;
  }

  /**
   * Check if phase transition is available
   */
  canTransitionToPhase(targetPhase) {
    const currentPhaseId = this.currentPhase?.id;
    const progress = this.getProgress(currentPhaseId);

    // Define transition rules
    const transitionRules = {
      single: {
        preparing: progress.percentage >= 80,
        engagement: false, // Must go through preparing first
      },
      preparing: {
        engagement: progress.percentage >= 75,
        single: true, // Can go back
      },
      engagement: {
        preparing: true, // Can go back
        single: false, // Cannot skip preparing
      },
    };

    const rules = transitionRules[currentPhaseId];
    return rules ? rules[targetPhase] || false : false;
  }

  /**
   * Suggest next phase based on current progress
   */
  suggestNextPhase() {
    const currentPhaseId = this.currentPhase?.id;
    const progress = this.getProgress(currentPhaseId);

    if (!currentPhaseId) {
      return { phase: 'single', reason: 'Start your dating journey' };
    }

    if (currentPhaseId === 'single' && progress.percentage >= 80) {
      return { phase: 'preparing', reason: 'Ready for serious relationships' };
    }

    if (currentPhaseId === 'preparing' && progress.percentage >= 75) {
      return { phase: 'engagement', reason: 'Ready for engagement and marriage' };
    }

    return null;
  }

  /**
   * Get phase statistics
   */
  getPhaseStatistics() {
    const stats = {
      currentPhase: this.currentPhase,
      totalMilestones: this.milestones.length,
      completedMilestones: this.milestones.filter(m => m.completed).length,
      phaseHistory: this.phaseHistory.length,
      overallProgress: 0,
    };

    // Calculate overall progress across all phases
    const progressValues = Object.values(this.phaseProgress);
    if (progressValues.length > 0) {
      stats.overallProgress = progressValues.reduce((sum, p) => sum + p.percentage, 0) / progressValues.length;
    }

    return stats;
  }

  /**
   * Recalculate phase progress based on milestones
   */
  async recalculatePhaseProgress(phaseId) {
    const phaseMilestones = this.getMilestones(phaseId);
    const completedCount = phaseMilestones.filter(m => m.completed).length;
    const totalCount = phaseMilestones.length;

    if (totalCount > 0) {
      const percentage = (completedCount / totalCount) * 100;
      await this.updateProgress(phaseId, percentage);
    }
  }

  /**
   * Merge milestones from different sources
   */
  mergeMilestones(local, remote) {
    const merged = [];
    const seenIds = new Set();

    // Add remote milestones first (server is source of truth for structure)
    remote.forEach(milestone => {
      merged.push(milestone);
      seenIds.add(milestone.id);
    });

    // Add local milestones that aren't on server
    local.forEach(milestone => {
      if (!seenIds.has(milestone.id)) {
        merged.push(milestone);
      } else {
        // Update completion status if local is more recent
        const existingIndex = merged.findIndex(m => m.id === milestone.id);
        if (milestone.completed && 
            (!merged[existingIndex].completed || 
             new Date(milestone.completedAt) > new Date(merged[existingIndex].completedAt))) {
          merged[existingIndex] = milestone;
        }
      }
    });

    return merged;
  }

  /**
   * Clear all phase data (for logout or reset)
   */
  async clearPhaseData() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PHASE),
        AsyncStorage.removeItem(STORAGE_KEYS.PHASE_PROGRESS),
        AsyncStorage.removeItem(STORAGE_KEYS.PHASE_MILESTONES),
        AsyncStorage.removeItem(STORAGE_KEYS.PHASE_HISTORY),
      ]);

      this.currentPhase = null;
      this.phaseProgress = {};
      this.milestones = [];
      this.phaseHistory = [];
    } catch (error) {
      console.error('Failed to clear phase data:', error);
    }
  }
}

// Export singleton instance
export const phaseManagementService = new PhaseManagementService();
export default phaseManagementService;