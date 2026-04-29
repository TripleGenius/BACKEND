import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
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

  @Get('sozdik/words')
  getSozdikWords() {
    return this.modules.getSozdikWords();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.modules.findBySlug(slug);
  }

  @Get(':slug/questions')
  getQuestions(
    @Param('slug') slug: string,
    @Query('lang') lang: string,
    @Request() req: any,
  ) {
    return this.modules.getQuestions(slug, lang, req.user.id);
  }
}
