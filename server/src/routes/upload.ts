import { Router } from 'express';
import {
  uploadFile,
  uploadEventDocument,
  serveFile
} from '../controllers/uploadController';
import { upload } from '../middleware/upload';

const router = Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload file
 *     description: Upload a general file (images, documents) to the server
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (images, documents, etc.)
 *             required:
 *               - file
 *           encoding:
 *             file:
 *               contentType: image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *             examples:
 *               image:
 *                 summary: Image file uploaded
 *                 value:
 *                   success: true
 *                   data:
 *                     filename: "1640995200000_regatta_photo.jpg"
 *                     originalname: "regatta_photo.jpg"
 *                     mimetype: "image/jpeg"
 *                     size: 2048576
 *                     url: "http://localhost:3001/uploads/1640995200000_regatta_photo.jpg"
 *               document:
 *                 summary: Document file uploaded
 *                 value:
 *                   success: true
 *                   data:
 *                     filename: "1640995200000_sailing_instructions.pdf"
 *                     originalname: "sailing_instructions.pdf"
 *                     mimetype: "application/pdf"
 *                     size: 1048576
 *                     url: "http://localhost:3001/uploads/1640995200000_sailing_instructions.pdf"
 *       400:
 *         description: Invalid file or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     - "No file provided"
 *                     - "File size too large (max 10MB)"
 *                     - "Invalid file type"
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "File too large"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/upload/events/{id}/documents:
 *   post:
 *     summary: Upload event document
 *     description: Upload a document specific to an event (sailing instructions, notices, results, etc.)
 *     tags: [Upload]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Document file to upload for the event
 *               documentType:
 *                 type: string
 *                 description: Type of document (optional)
 *                 enum: [sailing_instructions, notice_of_race, results, amendment, general]
 *                 example: "sailing_instructions"
 *             required:
 *               - document
 *           encoding:
 *             document:
 *               contentType: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
 *     responses:
 *       201:
 *         description: Event document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           description: Document record ID
 *                         event_id:
 *                           type: string
 *                           format: uuid
 *                           description: Associated event ID
 *                         document_name:
 *                           type: string
 *                           description: Original document name
 *                         document_type:
 *                           type: string
 *                           description: Type of document
 *                         file_url:
 *                           type: string
 *                           format: uri
 *                           description: URL to access the document
 *                         file_size_bytes:
 *                           type: integer
 *                           description: File size in bytes
 *                         mime_type:
 *                           type: string
 *                           description: MIME type of the file
 *                         uploaded_at:
 *                           type: string
 *                           format: date-time
 *                           description: Upload timestamp
 *             examples:
 *               sailing_instructions:
 *                 summary: Sailing instructions uploaded
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "789e4567-e89b-12d3-a456-426614174003"
 *                     event_id: "123e4567-e89b-12d3-a456-426614174000"
 *                     document_name: "Spring_Regatta_Sailing_Instructions.pdf"
 *                     document_type: "sailing_instructions"
 *                     file_url: "http://localhost:3001/uploads/events/1640995200000_sailing_instructions.pdf"
 *                     file_size_bytes: 524288
 *                     mime_type: "application/pdf"
 *                     uploaded_at: "2024-04-10T14:30:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "File too large"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/events/:id/documents', upload.single('document'), uploadEventDocument);

/**
 * @swagger
 * /api/upload/files/{filename}:
 *   get:
 *     summary: Serve uploaded file
 *     description: Retrieve and serve an uploaded file by filename. This endpoint serves static files that have been uploaded to the server.
 *     tags: [Upload]
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: Name of the file to retrieve
 *         schema:
 *           type: string
 *           example: "1640995200000_regatta_photo.jpg"
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Image file content
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *               description: PDF file content
 *           application/*:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Document file content
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               description: MIME type of the file
 *           Content-Length:
 *             schema:
 *               type: integer
 *               description: Size of the file in bytes
 *           Cache-Control:
 *             schema:
 *               type: string
 *               description: Cache control header
 *               example: "public, max-age=31536000"
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "File not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/files/:filename', serveFile);

export default router;