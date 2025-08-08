import { Router } from 'express';
import {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory
} from '../controllers/storyController';
import { validate, storySchema, storyUpdateSchema } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /api/stories:
 *   get:
 *     summary: List published stories with filtering and pagination
 *     description: Retrieve a paginated list of published stories with optional filtering by type, tags, and search terms
 *     tags: [Stories]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: storyType
 *         in: query
 *         description: Filter by story type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [news, racing, training, social, announcements]
 *       - $ref: '#/components/parameters/PublishedParam'
 *       - name: tags
 *         in: query
 *         description: Filter by tags (comma-separated)
 *         required: false
 *         schema:
 *           type: string
 *           example: "sailing,regatta,2024"
 *       - name: eventId
 *         in: query
 *         description: Filter by associated event ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Stories retrieved successfully
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
 *                         $ref: '#/components/schemas/Story'
 *             examples:
 *               stories:
 *                 summary: List of stories
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "123e4567-e89b-12d3-a456-426614174000"
 *                       title: "Spring Regatta Results"
 *                       slug: "spring-regatta-results"
 *                       excerpt: "Excellent racing conditions for this year's spring regatta"
 *                       content: "Full report on the spring regatta with detailed results..."
 *                       story_type: "racing"
 *                       featured_image_url: "https://example.com/image.jpg"
 *                       author_name: "Race Officer"
 *                       published: true
 *                       publish_date: "2024-04-16T14:30:00Z"
 *                       tags: ["regatta", "spring", "racing"]
 *                       created_at: "2024-04-15T10:30:00Z"
 *                       updated_at: "2024-04-16T14:30:00Z"
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 45
 *                     totalPages: 5
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getStories);

/**
 * @swagger
 * /api/stories/{id}:
 *   get:
 *     summary: Get story details
 *     description: Retrieve detailed information about a specific story
 *     tags: [Stories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Story ID or slug
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Story'
 *             examples:
 *               story:
 *                 summary: Story details
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "123e4567-e89b-12d3-a456-426614174000"
 *                     title: "Spring Regatta Results"
 *                     slug: "spring-regatta-results"
 *                     excerpt: "Excellent racing conditions for this year's spring regatta"
 *                     content: "Full detailed report on the spring regatta with race results, weather conditions, and participant feedback..."
 *                     story_type: "racing"
 *                     featured_image_url: "https://example.com/regatta-winner.jpg"
 *                     gallery_images: ["https://example.com/gallery1.jpg", "https://example.com/gallery2.jpg"]
 *                     author_name: "Race Officer John Smith"
 *                     published: true
 *                     publish_date: "2024-04-16T14:30:00Z"
 *                     event_id: "456e7890-e89b-12d3-a456-426614174001"
 *                     tags: ["regatta", "spring", "racing", "results"]
 *                     created_at: "2024-04-15T10:30:00Z"
 *                     updated_at: "2024-04-16T14:30:00Z"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', getStory);

/**
 * @swagger
 * /api/stories:
 *   post:
 *     summary: Create new story
 *     description: Create a new story/news article
 *     tags: [Stories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoryRequest'
 *           examples:
 *             news:
 *               summary: Create news story
 *               value:
 *                 title: "New Sailing Courses Available"
 *                 excerpt: "We're pleased to announce new sailing courses for beginners"
 *                 content: "Starting this summer, we will be offering comprehensive sailing courses..."
 *                 storyType: "news"
 *                 featuredImageUrl: "https://example.com/sailing-course.jpg"
 *                 authorName: "Training Officer"
 *                 published: true
 *                 tags: ["training", "courses", "beginners"]
 *             race_report:
 *               summary: Create race report
 *               value:
 *                 title: "Thursday Evening Race Series - Week 3"
 *                 excerpt: "Light winds made for tactical racing in week 3"
 *                 content: "With winds averaging 8 knots from the southwest..."
 *                 storyType: "racing"
 *                 authorName: "Race Officer"
 *                 published: true
 *                 tags: ["racing", "evening-series", "results"]
 *                 eventId: "789e4567-e89b-12d3-a456-426614174002"
 *     responses:
 *       201:
 *         description: Story created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Story'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', validate(storySchema), createStory);

/**
 * @swagger
 * /api/stories/{id}:
 *   put:
 *     summary: Update story
 *     description: Update an existing story/news article
 *     tags: [Stories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Story ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoryRequest'
 *           examples:
 *             update:
 *               summary: Update story details
 *               value:
 *                 title: "Updated: New Sailing Courses Available"
 *                 excerpt: "Updated information about our new sailing courses"
 *                 content: "Updated content with additional details about the courses..."
 *                 published: true
 *                 tags: ["training", "courses", "beginners", "updated"]
 *     responses:
 *       200:
 *         description: Story updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Story'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', validate(storyUpdateSchema), updateStory);

/**
 * @swagger
 * /api/stories/{id}:
 *   delete:
 *     summary: Delete story
 *     description: Delete an existing story/news article
 *     tags: [Stories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Story ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Story deleted successfully
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
 *                   example: "Story deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', deleteStory);

export default router;