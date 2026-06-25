import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolLink, LinkSchema } from './link.schema';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ToolLink.name, schema: LinkSchema }])],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
