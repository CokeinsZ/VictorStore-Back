import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from 'src/users/decorators/public.decorator';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { AbilityFactory, Action } from 'src/abilities/ability.factory';
import { CheckPolicies } from 'src/users/decorators/check-policies.decorator';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private abilityFactory: AbilityFactory,
      ) {}
    
      @Public()
      @Get()
      findAll() {
        return this.productsService.findAll();
      }
    
      @Public()
      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.productsService.findById(id);
      }
    
      @CheckPolicies({ action: Action.Create, subject: 'Product' })
      @Post()
      create(@Body() createProductDto: CreateProductDto, @Request() req) {
        return this.productsService.create(createProductDto, req.user.id);
      }
    
      @CheckPolicies({ action: Action.Update, subject: 'Product', checkData: true })
      @Put(':id')
      async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Request() req,
      ) {
        const product = await this.productsService.findById(id);
        const ability = this.abilityFactory.defineAbilitiesFor(req.user);
        
        // Manual check for entity-specific permissions
        if (!this.abilityFactory.can(ability, Action.Update, 'Product', product)) {
          throw new ForbiddenException('You can only update your own products');
        }
        
        return this.productsService.update(id, updateProductDto);
      }
    
      @CheckPolicies({ action: Action.Delete, subject: 'Product', checkData: true })
      @Delete(':id')
      async delete(@Param('id') id: string, @Request() req) {
        const product = await this.productsService.findById(id);
        const ability = this.abilityFactory.defineAbilitiesFor(req.user);
        
        // Manual check for entity-specific permissions
        if (!this.abilityFactory.can(ability, Action.Delete, 'Product', product)) {
          throw new ForbiddenException('You can only delete your own products');
        }
        
        return this.productsService.delete(id);
      }
      
      // Admin-only route example
      @CheckPolicies({ action: Action.Manage, subject: 'Product' })
      @Get('admin/all')
      findAllAdmin() {
        return this.productsService.findAll();
      }
    
}
