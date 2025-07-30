import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/auth/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createPetDto: CreatePetDto,
    @GetUser('userId') userId: string,
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
    return this.petsService.create(createPetDto, userId, secure_url, public_id);
  }

  @Auth()
  @Get()
  findAll(
    @GetUser('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.petsService.findAll(userId, paginationDto);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.petsService.findOneByIdAndOwner(id, userId);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
    @GetUser('userId') userId: string,
  ) {
    return this.petsService.update(id, updatePetDto, userId);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.petsService.remove(id, userId);
  }
}
