import { CreateBaseDispoDto } from './dto/create-base-dispo.dto';
import { addMinutes, format, isBefore, parse } from 'date-fns';
import { UpdateBaseDispoDto } from './dto/update-base-dispo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDispo } from './entities/base-dispo.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DaysOfWeek } from './models/enums/days-of-week.enum';

@Injectable()
export class BaseDispoService {
  constructor(
    @InjectRepository(BaseDispo)
    private readonly baseDispoRepository: Repository<BaseDispo>,
  ) {}

  async findSlotsByVetAndDay(vetId: string, day: DaysOfWeek) {
    const franja = await this.baseDispoRepository.findOne({
      where: { veterinarianId: vetId, dayOfWeek: day, isActive: true },
      select: { startTime: true, endTime: true },
    });

    if (!franja) throw new BadRequestException('slots not found');

    const { startTime, endTime } = franja;

    return this.generarSlotsPorFranja(startTime, endTime);
  }

  generarSlotsPorFranja(startTime: string, endTime: string) {
    const slots: string[] = []; // acá guardaremos cada hora generada como string

    const formato = 'HH:mm:ss'; // este será el formato de 24 horas (hora, minuto , segundo) tal cual está en nuestra bd

    let start = parse(startTime, formato, new Date()); // este parse convierte ese string en un Date con ese mismo formato
    const end = parse(endTime, formato, new Date()); // acá lo mismo

    while (isBefore(start, end)) {
      // ahora que ya son Date ya podemos comparar por eso usamos el isBefore, mientras start sea menor que end se agregará ese valor al array
      slots.push(format(start, 'HH:mm')); // se agrega al array y se le cambia el formato a horas y minutos
      start = addMinutes(start, 60); // se le agrega 1 hora a la hora inicial anterior y se vuelve a repetir todo
    }

    return slots;
  }

  async update(id: number, updateBaseDispoDto: UpdateBaseDispoDto) {
    const baseDispo = await this.baseDispoRepository.preload({
      id: id,
      ...updateBaseDispoDto,
    });

    if (!baseDispo) throw new NotFoundException(`Slot with id ${id} not found`);

    await this.baseDispoRepository.save(baseDispo);

    return baseDispo;
  }

  async desactiveSlot(id: number) {
    const slot = await this.baseDispoRepository.findOne({ where: { id } });

    if (!slot) throw new NotFoundException(`slot with id ${id} not found`);

    slot.isActive = false;
    await this.baseDispoRepository.save(slot);

    const { dayOfWeek, startTime, endTime } = slot;

    return {
      message: `${dayOfWeek} : ${startTime} - ${endTime} have been desactivated`,
    };
  }
}
