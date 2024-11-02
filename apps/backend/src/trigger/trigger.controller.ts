import { TriggerService } from './trigger.service'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UseGuards, Get, Param, Post, Body, Patch, Delete, Controller } from '@nestjs/common';


@ApiTags('triggers')
@Controller('triggers')
export class TriggerController {
    constructor(private readonly triggerService: TriggerService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all triggers' })
    @ApiResponse({ status: 200, description: 'Return all triggers.' })
    async findAll() {
        return this.triggerService.findAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Return the trigger.' })
    @ApiResponse({ status: 404, description: 'Trigger not found.' })
    async findOne(@Param('id') id: string) {
        return this.triggerService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiResponse({ status: 201, description: 'The trigger has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async create(@Body() createTriggerDto: any) {
        return this.triggerService.create(createTriggerDto)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a trigger by ID' })
    @ApiResponse({ status: 200, description: 'The trigger has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Trigger not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateTriggerDto: any,
    ){
        return this.triggerService.update(id, updateTriggerDto)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a trigger by ID' })
    @ApiResponse({ status: 200, description: 'The trigger has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Trigger not found.' })
    async delete(@Param('id') id: string) {
        return this.triggerService.delete(id)
    }
}
