import { PartialType } from '@nestjs/mapped-types';
import { CreateBaseDispoDto } from './create-base-dispo.dto';

export class UpdateBaseDispoDto extends PartialType(CreateBaseDispoDto) {}
