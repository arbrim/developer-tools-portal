import { Module } from '@nestjs/common';
import { LinksModule } from '../links/links.module';
import { UsersModule } from '../users/users.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, LinksModule],
  providers: [SeedService],
})
export class SeedModule {}
