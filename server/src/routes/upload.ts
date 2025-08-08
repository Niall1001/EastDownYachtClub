import { Router } from 'express';
import {
  uploadFile,
  uploadEventDocument,
  serveFile
} from '../controllers/uploadController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// POST /api/upload - General file upload
router.post('/', authenticateToken, upload.single('file'), uploadFile);

// POST /api/upload/events/:id/documents - Upload event documents
router.post('/events/:id/documents', authenticateToken, requireAdmin, upload.single('document'), uploadEventDocument);

// GET /api/upload/files/:filename - Serve uploaded files
router.get('/files/:filename', serveFile);

export default router;