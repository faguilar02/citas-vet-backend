import { Module } from '@nestjs/common';
import { BaseDispoService } from './base-dispo.service';
import { BaseDispoController } from './base-dispo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDispo } from './entities/base-dispo.entity';

@Module({
  controllers: [BaseDispoController],
  providers: [BaseDispoService],
  imports: [TypeOrmModule.forFeature([BaseDispo])]
})
export class BaseDispoModule {}
