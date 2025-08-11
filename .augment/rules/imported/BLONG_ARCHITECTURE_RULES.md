---
type: "always_apply"
description: "BLONG Architecture and Development Rules"
---

# BLONG Architecture & Development Rules

## 🏗️ BACKEND ARCHITECTURE RULES

### RULE 1: NestJS Module Structure - MANDATORY
```typescript
// ALWAYS follow this exact module structure
@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    // Other required modules
  ],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService], // Export services that other modules need
})
export class FeatureModule {}
```

### RULE 2: API Endpoint Standards - MANDATORY
```typescript
// ALWAYS use proper decorators and validation
@Controller('feature')
@ApiTags('Feature Management')
export class FeatureController {

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create feature', description: 'Detailed description' })
  @ApiResponse({ status: 201, description: 'Feature created successfully', type: ResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(
    @Body(ValidationPipe) createDto: CreateFeatureDto,
    @Request() req: any,
  ): Promise<ResponseDto> {
    return this.featureService.create(createDto, req.user.id);
  }
}
```

### RULE 3: Database Service Pattern - MANDATORY
```typescript
// ALWAYS use this service pattern with proper error handling
@Injectable()
export class FeatureService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFeatureDto, userId: string) {
    try {
      const result = await this.prisma.feature.create({
        data: {
          ...data,
          userId,
        },
        select: {
          id: true,
          // Only select needed fields
        },
      });

      return {
        success: true,
        data: result,
        message: 'Feature created successfully',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Feature already exists');
      }
      throw new InternalServerErrorException('Failed to create feature');
    }
  }
}
```

### RULE 4: DTO Validation - MANDATORY
```typescript
// ALWAYS use proper validation decorators
export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ description: 'Feature name', example: 'Feature Name' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ description: 'Feature description', required: false })
  description?: string;

  @IsEnum(FeatureType)
  @ApiProperty({ enum: FeatureType, description: 'Type of feature' })
  type: FeatureType;
}
```

## 📱 FRONTEND ARCHITECTURE RULES

### RULE 5: Screen Component Structure - MANDATORY
```javascript
// ALWAYS follow this exact screen structure
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { useTheme, useLanguage } from '../../contexts/AppContext';

const FeatureScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // ALWAYS include COLORS constant
  const COLORS = {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#0A0A0A',
    textSecondary: '#6B6B6B',
    textTertiary: '#9E9E9E',
    accent: '#FF6B35',
    border: '#E0E0E0',
    shadow: '#000000',
    success: '#4CAF50',
    warning: '#FF9800',
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Screen content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Content goes here */}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default FeatureScreen;
```

### RULE 6: Service Layer Pattern - MANDATORY
```javascript
// ALWAYS create services for API interactions
class FeatureService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getFeatures(params = {}) {
    try {
      const response = await apiService.get('/features', { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  async createFeature(data) {
    try {
      const response = await apiService.post('/features', data);
      return {
        success: true,
        data: response.data,
        message: 'Feature created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }
}

export const featureService = new FeatureService();
```