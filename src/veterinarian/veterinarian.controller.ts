import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VeterinarianService } from './veterinarian.service';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { UpdateVeterinarianDto } from './dto/update-veterinarian.dto';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/auth/models/enums';
import { PaginationDto } from 'src/auth/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('veterinarian')
export class VeterinarianController {
  constructor(
    private readonly veterinarianService: VeterinarianService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Auth(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body() createVeterinarianDto: CreateVeterinarianDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { secure_url, public_id } = await this.cloudinaryService.uploadFile(
      file,
    );
    return this.veterinarianService.create(
      createVeterinarianDto,
      secure_url,
      public_id,
    );
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.veterinarianService.findOne(id);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.veterinarianService.findAll(paginationDto);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateVeterinarianDto: UpdateVeterinarianDto,
  ) {
    return this.veterinarianService.update(+id, updateVeterinarianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veterinarianService.remove(+id);
  }
}
