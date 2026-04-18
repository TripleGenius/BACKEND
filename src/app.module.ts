import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ModulesModule } from './modules/modules.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ModulesModule, ProgressModule],
})
export class AppModule {}
