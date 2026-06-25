import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LinksService } from '../links/links.service';
import { UserRole } from '../users/user-role.enum';
import { UsersService } from '../users/users.service';
import { seedLinks } from './seed-data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly linksService: LinksService,
  ) {}

  async onApplicationBootstrap() {
    if (this.config.get<string>('SEED_ON_START') === 'false') {
      return;
    }

    const adminPassword = this.config.getOrThrow<string>('ADMIN_PASSWORD');
    const userPassword = this.config.getOrThrow<string>('USER_PASSWORD');

    await this.usersService.ensureUser({
      name: 'Portal Admin',
      email: this.config.getOrThrow<string>('ADMIN_EMAIL'),
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: UserRole.Admin,
    });

    await this.usersService.ensureUser({
      name: 'Portal User',
      email: this.config.getOrThrow<string>('USER_EMAIL'),
      passwordHash: await bcrypt.hash(userPassword, 12),
      role: UserRole.User,
    });

    await this.linksService.ensureSeedLinks(seedLinks);
    this.logger.log('Seed data ensured');
  }
}
