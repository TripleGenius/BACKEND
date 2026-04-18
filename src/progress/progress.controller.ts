import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progress: ProgressService) {}

  @Get()
  getAll(@Request() req: any) {
    return this.progress.getAll(req.user.id);
  }

  @Post(':moduleSlug')
  update(
    @Request() req: any,
    @Param('moduleSlug') moduleSlug: string,
    @Body() body: { completed: number },
  ) {
    return this.progress.update(req.user.id, moduleSlug, body.completed);
  }
}
