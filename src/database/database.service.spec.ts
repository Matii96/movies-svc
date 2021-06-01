import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationErrorItem } from 'sequelize';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error from database', () => {
    const dbError = { errors: [new ValidationErrorItem('Name is not unique')] };
    expect(() => service.handleDatabaseError(dbError)).toThrowError(BadRequestException);
  });

  it('should throw error', () => {
    const error = new Error('Simple error');
    expect(() => service.handleDatabaseError(error)).toThrowError(error);
  });
});
