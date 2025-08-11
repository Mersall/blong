-- CreateEnum
CREATE TYPE "SafetyReportCategory" AS ENUM ('INAPPROPRIATE_PHOTOS', 'HARASSMENT', 'FAKE_PROFILE', 'INAPPROPRIATE_BEHAVIOR', 'SPAM', 'SCAM', 'VIOLENCE_THREATS', 'UNDERAGE', 'PRIVACY_VIOLATION', 'OTHER');

-- CreateEnum
CREATE TYPE "SafetyReportSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SafetyReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "UserBlockReason" AS ENUM ('HARASSMENT', 'INAPPROPRIATE_CONTENT', 'SPAM', 'FAKE_PROFILE', 'PERSONAL_CHOICE', 'SAFETY_CONCERN', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('PHOTO', 'IDENTITY', 'PHONE', 'EMAIL', 'LIVE_PHOTO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "VerificationRequestStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SafetyCheckInStatus" AS ENUM ('SAFE', 'CHECKING_IN', 'OVERDUE', 'EMERGENCY', 'HELP_NEEDED', 'COMPLETED');

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "abilityEnhancing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "abilityUtilization" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "acceptanceLevel" TEXT,
ADD COLUMN     "accomplishmentCelebration" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "accountabilityAcceptance" TEXT,
ADD COLUMN     "achievementMeasurement" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "achievementOrientation" TEXT,
ADD COLUMN     "achievementSharing" TEXT,
ADD COLUMN     "achievementSupport" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "actionTaking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "adaptability" TEXT,
ADD COLUMN     "adaptabilitySkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "adventureLevel" TEXT,
ADD COLUMN     "adviceSeeking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "alternativeMedicine" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ambiguityComfort" TEXT,
ADD COLUMN     "ancestryInterest" TEXT,
ADD COLUMN     "anniversaryImportance" TEXT,
ADD COLUMN     "annualIncome" INTEGER,
ADD COLUMN     "anxietyManagement" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "appreciationShowing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "assistanceAccepting" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "attachmentStyle" TEXT,
ADD COLUMN     "balanceStrategies" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "beliefsExpressing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "belongingSense" TEXT,
ADD COLUMN     "biggestChallenges" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "birthPlace" TEXT,
ADD COLUMN     "birthTime" TEXT,
ADD COLUMN     "blessingOthers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "blessingRecognition" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "bondStrengthening" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "bookGenres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "boundariesEstablishment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "bucketList" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "buildingBridges" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "buildingTechniques" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "calmingTechniques" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "capacityExpanding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "careAccepting" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "careerAmbitions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "careerPriority" TEXT,
ADD COLUMN     "caregiving" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "celebrationStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "championMindset" TEXT,
ADD COLUMN     "chanceEmbracing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "changeAcceptance" TEXT,
ADD COLUMN     "changeEmbracing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "changeManagement" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "changingLives" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "childEducationPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cityVsCountry" TEXT,
ADD COLUMN     "clarityNeed" TEXT,
ADD COLUMN     "cleanlinessLevel" TEXT,
ADD COLUMN     "climatePreference" TEXT,
ADD COLUMN     "closenessBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "collaborationStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "comfortProviding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "comfortSeeking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "comfortZone" TEXT,
ADD COLUMN     "commitmentLevel" TEXT,
ADD COLUMN     "communicationStyle" TEXT,
ADD COLUMN     "communityInvolvement" TEXT,
ADD COLUMN     "communityRoots" TEXT,
ADD COLUMN     "communityWorship" TEXT,
ADD COLUMN     "compassionShowing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "competitiveness" TEXT,
ADD COLUMN     "conflictAvoidance" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "conflictResolution" TEXT,
ADD COLUMN     "connectionCreation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "consistencyValue" TEXT,
ADD COLUMN     "contentmentFinding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "contributionMaking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "conversationTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "convictionsShowing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cookingSkills" TEXT,
ADD COLUMN     "counselAccepting" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "creatingConnections" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cuisinePreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cultivatingLove" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "culturalBackground" TEXT,
ADD COLUMN     "culturalCelebrations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "culturalPassing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "curiosityLevel" TEXT,
ADD COLUMN     "dealBreakers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "debateComfort" TEXT,
ADD COLUMN     "debtStatus" TEXT,
ADD COLUMN     "decisionMaking" TEXT,
ADD COLUMN     "destinationFocus" TEXT,
ADD COLUMN     "developmentEmbracing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "developmentMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "differenceCreating" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "digitalDetox" TEXT,
ADD COLUMN     "directionSense" TEXT,
ADD COLUMN     "disabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "disappointmentCoping" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "diversityAppreciation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "educationLevel" TEXT,
ADD COLUMN     "elderCareThoughts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "emergencyFund" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emergencyPlanning" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "emotionalIntelligence" TEXT,
ADD COLUMN     "emotionalSupport" TEXT,
ADD COLUMN     "empathyLevel" TEXT,
ADD COLUMN     "empoweringIndividuals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "empowermentApproach" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "encouragementGiving" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "encouragementOffering" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "encouragingOthers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "energySources" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "enhancementPursuing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "entertainingStyle" TEXT,
ADD COLUMN     "environmentalConcerns" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ethicalStandards" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "eveningRoutine" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "evolutionWelcoming" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "excellenceCommitment" TEXT,
ADD COLUMN     "excellencePursuing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "excellencePursuit" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "executionStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "expectationsManagement" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "experienceValuing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "expertiseDeveloping" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "extracurricularActivities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "eyeColor" TEXT,
ADD COLUMN     "failureHandling" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "faithDemonstrating" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "faithImportance" TEXT,
ADD COLUMN     "faithSharing" TEXT,
ADD COLUMN     "familyIncome" TEXT,
ADD COLUMN     "familyReunions" TEXT,
ADD COLUMN     "familySize" INTEGER,
ADD COLUMN     "familyTraditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "familyType" TEXT,
ADD COLUMN     "favorAppreciation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "fearsToConcquer" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "fieldOfStudy" TEXT,
ADD COLUMN     "financialGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "fitnessGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "fitnessLevel" TEXT,
ADD COLUMN     "flexibilityLevel" TEXT,
ADD COLUMN     "flourishingPartnership" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "flourishingSupport" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "followshipSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "forgivenessCapacity" TEXT,
ADD COLUMN     "fosteringRelationships" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "friendshipStyle" TEXT,
ADD COLUMN     "fulfillmentSeeking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "futureAspirations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "genderRoles" TEXT,
ADD COLUMN     "generationalWealth" TEXT,
ADD COLUMN     "generosityAcknowledgment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "generosityLevel" TEXT,
ADD COLUMN     "giftAcknowledgment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "giftDeveloping" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "giftGiving" TEXT,
ADD COLUMN     "giftSharing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "giftTraditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "givingBack" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "givingStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "goalSetting" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "goalsFor10Years" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "goalsFor1Year" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "goalsFor5Years" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gratitudeExpression" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gratitudePracticing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "griefProcessing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "growingTogether" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "growthFacilitation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "growthMindset" TEXT,
ADD COLUMN     "growthWelcoming" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "guidanceWelcoming" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "guidelinesFollowing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "habitsToChange" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hairColor" TEXT,
ADD COLUMN     "happinessBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "happinessDefinition" TEXT,
ADD COLUMN     "harmonyCreation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "healingApproaches" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "healingFacilitation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "healthcarePreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "helpReceiving" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "helpingCommunity" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "heritagePreservation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hobbies" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "holidayImportance" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "honestyLevel" TEXT,
ADD COLUMN     "honeymoonPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hopeMaintenence" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hopeSharing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "householdChores" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "housingType" TEXT,
ADD COLUMN     "humorStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "identityImportance" TEXT,
ADD COLUMN     "impactMaking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "implementationMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "improvementFocus" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "improvementSeeking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "improvingWorld" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "inclusionPractices" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "indoorActivities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "initiativeShowing" TEXT,
ADD COLUMN     "insightDevelopment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "inspirationGiving" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "inspirationSources" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "inspirationalQuotes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "inspiringSouls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "insuranceCoverage" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "insurancePhilosophy" TEXT,
ADD COLUMN     "integrityImportance" TEXT,
ADD COLUMN     "intellectualConnection" TEXT,
ADD COLUMN     "interfaithComfort" TEXT,
ADD COLUMN     "intimacyDevelopment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "intimacyImportance" TEXT,
ADD COLUMN     "investmentKnowledge" TEXT,
ADD COLUMN     "journeyAppreciation" TEXT,
ADD COLUMN     "joyShowing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "kindnessExpressions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "kindnessRecognition" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "knowledgePursuit" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "knowledgeSharing" TEXT,
ADD COLUMN     "languagePreservation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lastUpdated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "leadershipReadiness" TEXT,
ADD COLUMN     "leadershipStyle" TEXT,
ADD COLUMN     "learningEagerness" TEXT,
ADD COLUMN     "learningEmbracing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "learningStyle" TEXT,
ADD COLUMN     "legacyBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "legacyGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lessonsLearned" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lifeChangingEvents" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lifeGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lifePhilosophy" TEXT,
ADD COLUMN     "limitsRespecting" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "livingArrangement" TEXT,
ADD COLUMN     "lossSupport" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "loveExpressing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "loveLanguagePrimary" TEXT,
ADD COLUMN     "loveLanguageSecondary" TEXT,
ADD COLUMN     "loveReceiving" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "loyaltyExpectations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maintenanceSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "marriageTimeline" TEXT,
ADD COLUMN     "masteryGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "masteryStriving" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maturityLevel" TEXT,
ADD COLUMN     "meaningOfLife" TEXT,
ADD COLUMN     "medicalConditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "meditationExperience" TEXT,
ADD COLUMN     "memoryCreating" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mentalHealthAwareness" TEXT,
ADD COLUMN     "mentoringWillingness" TEXT,
ADD COLUMN     "mentorshipNeeds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mentorshipWelcoming" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "milestoneMarking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "milestoneRecognition" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mindfulnessPractices" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "missionAlignment" TEXT,
ADD COLUMN     "missionWork" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "modernityAcceptance" TEXT,
ADD COLUMN     "momentCherishing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "moralValues" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "morningRoutine" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "motherTongue" TEXT,
ADD COLUMN     "motivatingPeople" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "motivationFactors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "motivationSharing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "movieGenres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "musicPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "naturalDisasterPreparedness" TEXT,
ADD COLUMN     "neighborhoodPreference" TEXT,
ADD COLUMN     "networkingImportance" TEXT,
ADD COLUMN     "nurturingBonds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "nurturingStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "nutritionAwareness" TEXT,
ADD COLUMN     "nutritionGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "onlinePrivacy" TEXT,
ADD COLUMN     "opinionRespect" TEXT,
ADD COLUMN     "opinionSharing" TEXT,
ADD COLUMN     "opportunitySeizing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "optimismLevel" TEXT,
ADD COLUMN     "organizationLevel" TEXT,
ADD COLUMN     "outdoorActivities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "parentStatus" TEXT,
ADD COLUMN     "parentingStyle" TEXT,
ADD COLUMN     "partnershipApproach" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "pathFinding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "patienceLevel" TEXT,
ADD COLUMN     "peaceBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "peaceCreating" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "perfectionSeeking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "personalGrowthAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "personalMotto" TEXT,
ADD COLUMN     "personalityType" TEXT,
ADD COLUMN     "perspectiveGaining" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "petPreference" TEXT,
ADD COLUMN     "philanthropyInterest" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "physicalAffection" TEXT,
ADD COLUMN     "planningApproach" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "planningStyle" TEXT,
ADD COLUMN     "politicalViews" TEXT,
ADD COLUMN     "positivitySources" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "possibilityExploring" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "potentialRealization" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "potentialRealizing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prayerLife" TEXT,
ADD COLUMN     "preventiveCare" TEXT,
ADD COLUMN     "principlesUpholding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "privacyLevel" TEXT,
ADD COLUMN     "problemSolving" TEXT,
ADD COLUMN     "progressTracking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "protectionOffering" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "proudestAchievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "punctuality" TEXT,
ADD COLUMN     "purposeFulfillment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "qualityFocus" TEXT,
ADD COLUMN     "receivingComfort" TEXT,
ADD COLUMN     "recognitionImportance" TEXT,
ADD COLUMN     "reconciliationSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recoveryMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "refinementWelcoming" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "relationshipBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "relationshipGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "relaxationMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "reliabilityRating" TEXT,
ADD COLUMN     "religiousObservance" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "religiousTolerance" TEXT,
ADD COLUMN     "relocateWillingness" TEXT,
ADD COLUMN     "renewalMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "renewalProcesses" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "resilienceBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "responsibilitySharing" TEXT,
ADD COLUMN     "restorationMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "restorativePractices" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "retirementAge" INTEGER,
ADD COLUMN     "retirementPlans" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "retirementVision" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "riskAssessment" TEXT,
ADD COLUMN     "riskTolerance" TEXT,
ADD COLUMN     "roleModels" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "romanticGestures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "routineImportance" TEXT,
ADD COLUMN     "rulesAdherence" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "safetyCreation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "safetyPriorities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "satisfactionPursuing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "scripturalStudy" TEXT,
ADD COLUMN     "seasonalPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "securityBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "securityMeasures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "securityProviding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "selfAwareness" TEXT,
ADD COLUMN     "selfCareRoutine" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "serviceOffering" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "serviceOpportunities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "servingSociety" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sharingWealth" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "siblingCount" INTEGER,
ADD COLUMN     "skillBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skillDevelopment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skillRefinement" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skillsToLearn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skinTone" TEXT,
ADD COLUMN     "sleepSchedule" TEXT,
ADD COLUMN     "socialCircle" TEXT,
ADD COLUMN     "socialEvents" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "socialMediaPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "socialMediaUsage" TEXT,
ADD COLUMN     "specialOccasions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "spendingHabits" TEXT,
ADD COLUMN     "spiritualConnection" TEXT,
ADD COLUMN     "spiritualGrowth" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "spiritualPractices" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "spokenLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "spontaneity" TEXT,
ADD COLUMN     "sportsActivities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "stabilityCreation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "standardsSetting" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "strengthBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "strengthFinding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "strengthMaximization" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "strengtheningCommunities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "strengtheningSystems" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "strengthsToLeverage" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "stressManagement" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "stressReduction" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "structureNeeds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "successCelebration" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "successDefinition" TEXT,
ADD COLUMN     "successEnabling" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "successMetrics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "supportOffering" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "supportProviding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "supportSystemNeeds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "supportWelcoming" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "surpriseAppreciation" TEXT,
ADD COLUMN     "talentCultivating" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "talentDevelopment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "teachingReceiving" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "teamworkPreference" TEXT,
ADD COLUMN     "technologyComfort" TEXT,
ADD COLUMN     "tensionRelief" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "thankfulnessExpressing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "therapyOpenness" TEXT,
ADD COLUMN     "thrivingEnablement" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "thrivingRelationship" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "timeManagement" TEXT,
ADD COLUMN     "toleranceShowing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "touchingHearts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "traditionImportance" TEXT,
ADD COLUMN     "transformationAccepting" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "transformationOpenness" TEXT,
ADD COLUMN     "transitionHandling" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "travelDestinations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "travelFrequency" TEXT,
ADD COLUMN     "triumphRecognition" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "trustBuilding" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "uncertaintyTolerance" TEXT,
ADD COLUMN     "understandingOffering" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "understandingSeeking" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "upliftingMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "upliftingSpirits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "vacationBudget" TEXT,
ADD COLUMN     "vacationFrequency" TEXT,
ADD COLUMN     "values" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "valuesLiving" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "victorySharing" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "viewpointSharing" TEXT,
ADD COLUMN     "visionClarity" TEXT,
ADD COLUMN     "volunteerWork" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "weatherSensitivity" TEXT,
ADD COLUMN     "weddingBudget" TEXT,
ADD COLUMN     "weddingStyle" TEXT,
ADD COLUMN     "weekendActivities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "wellnessRoutines" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "winningAttitude" TEXT,
ADD COLUMN     "wisdomGathering" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "wisdomSeeking" TEXT,
ADD COLUMN     "workExperience" INTEGER,
ADD COLUMN     "workLifeBalance" TEXT,
ADD COLUMN     "workLocation" TEXT,
ADD COLUMN     "workMotivation" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "workSchedule" TEXT,
ADD COLUMN     "workoutPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "zodiacSign" TEXT;

-- CreateTable
CREATE TABLE "safety_reports" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "category" "SafetyReportCategory" NOT NULL,
    "subcategory" TEXT,
    "description" TEXT NOT NULL,
    "evidence" JSONB,
    "severity" "SafetyReportSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "SafetyReportStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "resolution" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "safety_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_blocks" (
    "id" TEXT NOT NULL,
    "blockingUserId" TEXT NOT NULL,
    "blockedUserId" TEXT NOT NULL,
    "reason" "UserBlockReason",
    "description" TEXT,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verificationType" "VerificationType" NOT NULL,
    "status" "VerificationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "adminNotes" TEXT,
    "documentType" TEXT,
    "documentImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "selfieImage" TEXT,
    "livePhotoImage" TEXT,
    "metadata" JSONB,

    CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_check_ins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SafetyCheckInStatus" NOT NULL DEFAULT 'SAFE',
    "location" JSONB,
    "plannedDuration" INTEGER,
    "actualDuration" INTEGER,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedEndTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "emergencyTriggered" BOOLEAN NOT NULL DEFAULT false,
    "emergencyTime" TIMESTAMP(3),
    "notes" TEXT,
    "metadata" JSONB,

    CONSTRAINT "safety_check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "relationship" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "safety_reports_reporterId_idx" ON "safety_reports"("reporterId");

-- CreateIndex
CREATE INDEX "safety_reports_reportedUserId_idx" ON "safety_reports"("reportedUserId");

-- CreateIndex
CREATE INDEX "safety_reports_status_idx" ON "safety_reports"("status");

-- CreateIndex
CREATE INDEX "safety_reports_category_idx" ON "safety_reports"("category");

-- CreateIndex
CREATE INDEX "safety_reports_submittedAt_idx" ON "safety_reports"("submittedAt");

-- CreateIndex
CREATE INDEX "user_blocks_blockingUserId_idx" ON "user_blocks"("blockingUserId");

-- CreateIndex
CREATE INDEX "user_blocks_blockedUserId_idx" ON "user_blocks"("blockedUserId");

-- CreateIndex
CREATE INDEX "user_blocks_isActive_idx" ON "user_blocks"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "user_blocks_blockingUserId_blockedUserId_key" ON "user_blocks"("blockingUserId", "blockedUserId");

-- CreateIndex
CREATE INDEX "verification_requests_userId_idx" ON "verification_requests"("userId");

-- CreateIndex
CREATE INDEX "verification_requests_status_idx" ON "verification_requests"("status");

-- CreateIndex
CREATE INDEX "verification_requests_verificationType_idx" ON "verification_requests"("verificationType");

-- CreateIndex
CREATE INDEX "verification_requests_submittedAt_idx" ON "verification_requests"("submittedAt");

-- CreateIndex
CREATE INDEX "safety_check_ins_userId_idx" ON "safety_check_ins"("userId");

-- CreateIndex
CREATE INDEX "safety_check_ins_status_idx" ON "safety_check_ins"("status");

-- CreateIndex
CREATE INDEX "safety_check_ins_checkInTime_idx" ON "safety_check_ins"("checkInTime");

-- CreateIndex
CREATE INDEX "safety_check_ins_emergencyTriggered_idx" ON "safety_check_ins"("emergencyTriggered");

-- CreateIndex
CREATE INDEX "emergency_contacts_userId_idx" ON "emergency_contacts"("userId");

-- CreateIndex
CREATE INDEX "emergency_contacts_isPrimary_idx" ON "emergency_contacts"("isPrimary");

-- CreateIndex
CREATE INDEX "emergency_contacts_isActive_idx" ON "emergency_contacts"("isActive");

-- AddForeignKey
ALTER TABLE "safety_reports" ADD CONSTRAINT "safety_reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_reports" ADD CONSTRAINT "safety_reports_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockingUserId_fkey" FOREIGN KEY ("blockingUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_check_ins" ADD CONSTRAINT "safety_check_ins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
