/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, Body, UsePipes, ValidationPipe, Get, Query, DefaultValuePipe, ParseIntPipe, Param, Put, HttpCode, HttpStatus, BadRequestException, Delete, NotFoundException, Patch, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';

@Controller('users')
export class UsersController {

    constructor(private service: UsersService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createUser(@Body() body: User) {
        this.service.addOneUser(body);
    }

    @Get()
    getAllUser(@Query('_page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('_limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
        return this.service.getAllUsers(page, limit);
    }

    @Get('/:id')
    getUserById(@Param('id') _id: string) {
        return this.service.getUserById(_id);
    }

    @Put('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateUserById(@Param('id') _id: string, @Body() body: User) {
        try {
            await this.service.updateUserById(_id, body);
        } catch (error) {
            throw new BadRequestException();
        }
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async partialUpdateUserById(@Param('id') _id: string, @Body() props) {
        try {
            await this.service.partialUpdateUserById(_id, props);
        } catch (error) {
            console.log(error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUserById(@Param('id') _id: string) {
        try {
            const response = await this.service.deleteUserById(_id);
            if ( response.deletedCount === 0 ) {
                throw new NotFoundException();
            }
        } catch (error) {
            throw new BadRequestException();
        }
    }
}
