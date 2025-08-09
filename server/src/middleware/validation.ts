import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const response: ApiResponse = {
        success: false,
        error: error.details[0].message,
      };
      res.status(400).json(response);
      return;
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const response: ApiResponse = {
        success: false,
        error: error.details[0].message,
      };
      res.status(400).json(response);
      return;
    }
    
    next();
  };
};

// Common validation schemas
export const loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(50),
  password: Joi.string().required().min(6),
});

export const eventSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  description: Joi.string().allow('', null).optional(),
  eventType: Joi.string().valid('social', 'regatta', 'series', 'racing', 'training', 'cruising', 'committee').required(),
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().optional(),
  startTime: Joi.string().optional(),
  location: Joi.string().allow('', null).optional().max(200),
});

export const eventUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().allow('', null).optional(),
  eventType: Joi.string().valid('social', 'regatta', 'series', 'racing', 'training', 'cruising', 'committee').optional(),
  startDate: Joi.string().isoDate().optional(),
  endDate: Joi.string().isoDate().optional(),
  startTime: Joi.string().optional(),
  location: Joi.string().allow('', null).optional().max(200),
});

export const boatEntrySchema = Joi.object({
  boatName: Joi.string().required().max(100),
  skipper: Joi.string().required().max(100),
  sailNumber: Joi.string().required().max(20),
  class: Joi.string().required().max(100),
});

export const storySchema = Joi.object({
  title: Joi.string().required().min(1).max(300),
  excerpt: Joi.string().allow('', null).optional(),
  content: Joi.string().required(),
  storyType: Joi.string().valid('news', 'racing', 'training', 'social', 'announcement').optional(),
  featuredImageUrl: Joi.string().uri().allow('', null).optional(),
  galleryImages: Joi.array().items(Joi.string()).optional(),
  authorName: Joi.string().allow('', null).optional().max(100),
  published: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  eventId: Joi.string().uuid().allow('', null).optional(),
});

export const storyUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(300).optional(),
  excerpt: Joi.string().allow('', null).optional(),
  content: Joi.string().optional(),
  storyType: Joi.string().valid('news', 'racing', 'training', 'social', 'announcement').optional(),
  featuredImageUrl: Joi.string().uri().allow('', null).optional(),
  galleryImages: Joi.array().items(Joi.string()).optional(),
  authorName: Joi.string().allow('', null).optional().max(100),
  published: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  eventId: Joi.string().uuid().allow('', null).optional(),
});

export const raceSchema = Joi.object({
  yachtClassId: Joi.string().uuid().required(),
  raceNumber: Joi.number().integer().min(1).optional(),
  raceDate: Joi.string().isoDate().required(),
  startTime: Joi.string().optional(),
  windDirection: Joi.string().allow('', null).optional().max(100),
  windSpeed: Joi.number().integer().min(0).optional(),
  notes: Joi.string().allow('', null).optional(),
});

export const raceResultsSchema = Joi.object({
  results: Joi.array().items(
    Joi.object({
      sailNumber: Joi.string().required().max(20),
      yachtName: Joi.string().allow('', null).optional().max(100),
      helmName: Joi.string().allow('', null).optional().max(100),
      crewNames: Joi.string().allow('', null).optional(),
      finishTime: Joi.string().optional(),
      elapsedTime: Joi.string().optional(),
      correctedTime: Joi.string().optional(),
      position: Joi.number().integer().min(1).optional(),
      points: Joi.number().integer().min(0).optional(),
      disqualified: Joi.boolean().optional(),
      dns: Joi.boolean().optional(),
      dnf: Joi.boolean().optional(),
      retired: Joi.boolean().optional(),
      notes: Joi.string().allow('', null).optional(),
    })
  ).required(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
  type: Joi.string().optional(),
  published: Joi.boolean().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});