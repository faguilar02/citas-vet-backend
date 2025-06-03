import { Module } from '@nestjs/common';
import { BaseDispoService } from './base-dispo.service';
import { BaseDispoController } from './base-dispo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDispo } from './entities/base-dispo.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BaseDispoController],
  providers: [BaseDispoService],
  imports: [TypeOrmModule.forFeature([BaseDispo]), AuthModule]
})
export class BaseDispoModule {}
