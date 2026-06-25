import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { validateConfig } from './config/validate-config';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    LinksModule,
    SeedModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
