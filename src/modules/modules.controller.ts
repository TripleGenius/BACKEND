import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ModulesService } from './modules.service';

@Controller('modules')
@UseGuards(JwtAuthGuard)
export class ModulesController {
  constructor(private modules: ModulesService) {}

  @Get()
  findAll() {
    return this.modules.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.modules.findBySlug(slug);
  }

  @Get(':slug/questions')
  getQuestions(@Param('slug') slug: string) {
    return this.modules.getQuestions(slug);
  }
}
