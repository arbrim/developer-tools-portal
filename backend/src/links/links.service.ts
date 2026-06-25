import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ToolLink, LinkDocument } from './link.schema';

@Injectable()
export class LinksService {
  constructor(@InjectModel(ToolLink.name) private readonly linkModel: Model<LinkDocument>) {}

  findAll(includeInactive = false) {
    const query = includeInactive ? {} : { isActive: true };
    return this.linkModel.find(query).sort({ category: 1, title: 1 }).exec();
  }

  create(dto: CreateLinkDto) {
    return this.linkModel.create(dto);
  }

  async update(id: string, dto: UpdateLinkDto) {
    const link = await this.linkModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }

  async remove(id: string) {
    const link = await this.linkModel.findByIdAndDelete(id).exec();
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return { deleted: true };
  }

  async ensureSeedLinks(links: CreateLinkDto[]) {
    const count = await this.linkModel.estimatedDocumentCount().exec();
    if (count > 0) {
      return;
    }

    await this.linkModel.insertMany(links);
  }
}
