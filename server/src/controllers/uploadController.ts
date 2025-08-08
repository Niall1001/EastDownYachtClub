import { Response, NextFunction } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

export const uploadFile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.file) {
    const response: ApiResponse = {
      success: false,
      error: 'No file uploaded',
    };
    res.status(400).json(response);
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  logger.info(`File uploaded: ${req.file.filename}`, { userId: req.user?.id, fileSize: req.file.size });

  const response: ApiResponse = {
    success: true,
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: fileUrl
    },
    message: 'File uploaded successfully',
  };

  res.status(201).json(response);
});

export const uploadEventDocument = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id: eventId } = req.params;
  
  if (!req.file) {
    const response: ApiResponse = {
      success: false,
      error: 'No document uploaded',
    };
    res.status(400).json(response);
    return;
  }

  const event = await prisma.events.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    const response: ApiResponse = {
      success: false,
      error: 'Event not found',
    };
    res.status(404).json(response);
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  const document = await prisma.event_documents.create({
    data: {
      event_id: eventId,
      document_name: req.file.originalname,
      document_type: req.body.documentType || 'general',
      file_url: fileUrl,
      file_size_bytes: req.file.size,
      mime_type: req.file.mimetype
    }
  });

  logger.info(`Event document uploaded: ${document.id}`, { 
    userId: req.user?.id, 
    eventId, 
    filename: req.file.filename 
  });

  const response: ApiResponse = {
    success: true,
    data: document,
    message: 'Event document uploaded successfully',
  };

  res.status(201).json(response);
});

export const serveFile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    const response: ApiResponse = {
      success: false,
      error: 'File not found',
    };
    res.status(404).json(response);
    return;
  }

  // Security check - ensure the file is within the uploads directory
  const resolvedPath = path.resolve(filePath);
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  
  if (!resolvedPath.startsWith(uploadsPath)) {
    const response: ApiResponse = {
      success: false,
      error: 'Access denied',
    };
    res.status(403).json(response);
    return;
  }

  res.sendFile(resolvedPath);
});