import { Router } from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  addBoatEntry,
  removeBoatEntry
} from '../controllers/eventController';
import { validate, eventSchema, eventUpdateSchema, boatEntrySchema } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: List events with filtering and pagination
 *     description: Retrieve a paginated list of events with optional filtering by type, date range, and search terms
 *     tags: [Events]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: eventType
 *         in: query
 *         description: Filter by event type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [social, regatta, series, racing, training, cruising, committee]
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 *             examples:
 *               events:
 *                 summary: List of events
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "123e4567-e89b-12d3-a456-426614174000"
 *                       title: "Spring Regatta 2024"
 *                       description: "Annual spring sailing regatta"
 *                       event_type: "regatta"
 *                       start_date: "2024-04-15"
 *                       end_date: "2024-04-16"
 *                       start_time: "10:00:00"
 *                       location: "East Down Yacht Club"
 *                       created_at: "2024-01-15T10:30:00Z"
 *                       updated_at: "2024-01-15T10:30:00Z"
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 25
 *                     totalPages: 3
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event details
 *     description: Retrieve detailed information about a specific event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Event details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *             examples:
 *               event:
 *                 summary: Event details
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "123e4567-e89b-12d3-a456-426614174000"
 *                     title: "Spring Regatta 2024"
 *                     description: "Annual spring sailing regatta with multiple races"
 *                     event_type: "regatta"
 *                     start_date: "2024-04-15"
 *                     end_date: "2024-04-16"
 *                     start_time: "10:00:00"
 *                     location: "East Down Yacht Club"
 *                     created_at: "2024-01-15T10:30:00Z"
 *                     updated_at: "2024-01-15T10:30:00Z"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', getEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create new event
 *     description: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventRequest'
 *           examples:
 *             regatta:
 *               summary: Create regatta event
 *               value:
 *                 title: "Summer Regatta 2024"
 *                 description: "Annual summer regatta event"
 *                 eventType: "regatta"
 *                 startDate: "2024-07-15"
 *                 endDate: "2024-07-16"
 *                 startTime: "09:30"
 *                 location: "East Down Yacht Club"
 *             social:
 *               summary: Create social event
 *               value:
 *                 title: "Annual BBQ"
 *                 description: "End of season BBQ for all members"
 *                 eventType: "social"
 *                 startDate: "2024-09-21"
 *                 startTime: "18:00"
 *                 location: "Club House"
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', validate(eventSchema), createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update event
 *     description: Update an existing event
 *     tags: [Events]
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventRequest'
 *           examples:
 *             update:
 *               summary: Update event details
 *               value:
 *                 title: "Spring Regatta 2024 - Updated"
 *                 description: "Updated description for the regatta"
 *                 startTime: "10:30"
 *                 location: "Updated location"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', validate(eventUpdateSchema), updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event
 *     description: Delete an existing event and all associated data
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', deleteEvent);

/**
 * @swagger
 * /api/events/{id}/entries:
 *   post:
 *     summary: Add boat entry to event
 *     description: Register a boat for participation in an event
 *     tags: [Events]
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoatEntry'
 *           examples:
 *             entry:
 *               summary: Boat entry
 *               value:
 *                 boatName: "Sea Spirit"
 *                 skipper: "John Doe"
 *                 sailNumber: "IRL1234"
 *                 class: "Cruiser Class 1"
 *     responses:
 *       201:
 *         description: Boat entry added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BoatEntry'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/:id/entries', validate(boatEntrySchema), addBoatEntry);

/**
 * @swagger
 * /api/events/{id}/entries/{entryId}:
 *   delete:
 *     summary: Remove boat entry from event
 *     description: Remove a boat's registration from an event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: entryId
 *         in: path
 *         required: true
 *         description: Boat entry ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Boat entry removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Boat entry removed successfully"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id/entries/:entryId', removeBoatEntry);

export default router;