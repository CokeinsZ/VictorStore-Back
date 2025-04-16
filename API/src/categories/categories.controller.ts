import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Put,
    Delete,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Public } from 'src/users/decorators/public.decorator';
  import { CategoriesService } from './categories.service';
  import { CreateCategoryDto } from './dto/category.dto';
  import { UpdateCategoryDto } from './dto/category.dto';
import { CheckPolicies } from 'src/users/decorators/check-policies.decorator';
import { Action } from 'src/abilities/ability.factory';
import { memoryStorage } from 'multer';

  @Controller('categories')
  export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
  
    @Post('files/upload')
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      console.log(file);
      return {
        message: 'File uploaded successfully',
        fileName: file.originalname,
      };
    }
  
    @Post()
    @CheckPolicies({ action: Action.Create, subject: 'Category' })
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    create(
      @Body() createCategoryDto: CreateCategoryDto,
      @UploadedFile() file: Express.Multer.File)
    {
      return this.categoriesService.create(createCategoryDto, file);
    }
  
    @Get()
    @Public()
    findAll() {
      return this.categoriesService.findAll();
    }
  
    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
      return this.categoriesService.findOne(id);
    }
  
    @Put(':id')
    @CheckPolicies({ action: Action.Update, subject: 'Category' })
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    update(
      @Param('id') id: string,
      @Body() updateCategoryDto: UpdateCategoryDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.categoriesService.update(id, updateCategoryDto, file);
    }
  
    @Delete(':id')
    @CheckPolicies({ action: Action.Delete, subject: 'Category' })
    remove(@Param('id') id: string) {
      return this.categoriesService.remove(id);
    }
  }
  