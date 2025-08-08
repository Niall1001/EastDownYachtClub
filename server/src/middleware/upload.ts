import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter for security
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed mime types
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files at once
  },
});

// Middleware for single file upload with error handling
export const uploadSingle = (fieldName: string) => {
  return (req: any, res: any, next: any) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        let message = 'File upload error';
        
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = 'File too large. Maximum size is 10MB.';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = 'Unexpected field name.';
            break;
          case 'LIMIT_FILE_COUNT':
            message = 'Too many files.';
            break;
        }
        
        return res.status(400).json({
          success: false,
          error: message,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
      
      next();
    });
  };
};

// Middleware for multiple file upload with error handling
export const uploadMultiple = (fieldName: string, maxCount: number) => {
  return (req: any, res: any, next: any) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    
    multipleUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        let message = 'File upload error';
        
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = 'One or more files are too large. Maximum size is 10MB per file.';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = 'Unexpected field name.';
            break;
          case 'LIMIT_FILE_COUNT':
            message = `Too many files. Maximum is ${maxCount}.`;
            break;
        }
        
        return res.status(400).json({
          success: false,
          error: message,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
      
      next();
    });
  };
};