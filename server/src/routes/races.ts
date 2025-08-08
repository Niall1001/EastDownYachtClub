import { Router } from 'express';
import {
  getEventRaces,
  createRace,
  getRaceResults,
  submitRaceResults
} from '../controllers/raceController';
import { validate, raceSchema, raceResultsSchema } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /api/races/events/{eventId}:
 *   get:
 *     summary: List races for event
 *     description: Retrieve all races associated with a specific event
 *     tags: [Races]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: yachtClassId
 *         in: query
 *         description: Filter by yacht class ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Races retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Race'
 *             examples:
 *               races:
 *                 summary: List of races for event
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "123e4567-e89b-12d3-a456-426614174000"
 *                       event_id: "456e7890-e89b-12d3-a456-426614174001"
 *                       yacht_class_id: "789e4567-e89b-12d3-a456-426614174002"
 *                       race_number: 1
 *                       race_date: "2024-04-15"
 *                       start_time: "14:00:00"
 *                       wind_direction: "SW"
 *                       wind_speed: 12
 *                       notes: "Perfect racing conditions"
 *                       created_at: "2024-04-10T10:30:00Z"
 *                       updated_at: "2024-04-15T14:30:00Z"
 *                     - id: "234e5678-e89b-12d3-a456-426614174003"
 *                       event_id: "456e7890-e89b-12d3-a456-426614174001"
 *                       yacht_class_id: "789e4567-e89b-12d3-a456-426614174002"
 *                       race_number: 2
 *                       race_date: "2024-04-15"
 *                       start_time: "15:30:00"
 *                       wind_direction: "SW"
 *                       wind_speed: 10
 *                       notes: null
 *                       created_at: "2024-04-10T10:30:00Z"
 *                       updated_at: "2024-04-15T15:45:00Z"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/events/:eventId', getEventRaces);

/**
 * @swagger
 * /api/races/events/{eventId}:
 *   post:
 *     summary: Create race for event
 *     description: Create a new race within a specific event
 *     tags: [Races]
 *     parameters:
 *       - name: eventId
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
 *             $ref: '#/components/schemas/CreateRaceRequest'
 *           examples:
 *             race1:
 *               summary: Create first race
 *               value:
 *                 yachtClassId: "789e4567-e89b-12d3-a456-426614174002"
 *                 raceNumber: 1
 *                 raceDate: "2024-04-15"
 *                 startTime: "14:00"
 *                 windDirection: "SW"
 *                 windSpeed: 12
 *                 notes: "Perfect racing conditions with steady breeze"
 *             race2:
 *               summary: Create second race
 *               value:
 *                 yachtClassId: "789e4567-e89b-12d3-a456-426614174002"
 *                 raceNumber: 2
 *                 raceDate: "2024-04-15"
 *                 startTime: "15:30"
 *                 windDirection: "SW"
 *                 windSpeed: 10
 *     responses:
 *       201:
 *         description: Race created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Race'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/events/:eventId', validate(raceSchema), createRace);

/**
 * @swagger
 * /api/races/{id}/results:
 *   get:
 *     summary: Get race results
 *     description: Retrieve results for a specific race
 *     tags: [Races]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Race ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Race results retrieved successfully
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
 *                         race:
 *                           $ref: '#/components/schemas/Race'
 *                         results:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/RaceResult'
 *             examples:
 *               results:
 *                 summary: Race results with rankings
 *                 value:
 *                   success: true
 *                   data:
 *                     race:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       event_id: "456e7890-e89b-12d3-a456-426614174001"
 *                       yacht_class_id: "789e4567-e89b-12d3-a456-426614174002"
 *                       race_number: 1
 *                       race_date: "2024-04-15"
 *                       start_time: "14:00:00"
 *                       wind_direction: "SW"
 *                       wind_speed: 12
 *                     results:
 *                       - id: "345e6789-e89b-12d3-a456-426614174004"
 *                         race_id: "123e4567-e89b-12d3-a456-426614174000"
 *                         sail_number: "IRL1234"
 *                         yacht_name: "Sea Spirit"
 *                         helm_name: "John Doe"
 *                         crew_names: "Jane Doe, Bob Smith"
 *                         finish_time: "15:45:30"
 *                         position: 1
 *                         points: 1
 *                         disqualified: false
 *                         dns: false
 *                         dnf: false
 *                         retired: false
 *                         created_at: "2024-04-15T15:50:00Z"
 *                         updated_at: "2024-04-15T15:50:00Z"
 *                       - id: "456e7890-e89b-12d3-a456-426614174005"
 *                         race_id: "123e4567-e89b-12d3-a456-426614174000"
 *                         sail_number: "IRL5678"
 *                         yacht_name: "Wind Walker"
 *                         helm_name: "Mary Johnson"
 *                         crew_names: "Tom Wilson"
 *                         finish_time: "15:47:15"
 *                         position: 2
 *                         points: 2
 *                         disqualified: false
 *                         dns: false
 *                         dnf: false
 *                         retired: false
 *                         created_at: "2024-04-15T15:50:00Z"
 *                         updated_at: "2024-04-15T15:50:00Z"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id/results', getRaceResults);

/**
 * @swagger
 * /api/races/{id}/results:
 *   post:
 *     summary: Submit race results
 *     description: Submit or update results for a specific race
 *     tags: [Races]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Race ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitRaceResultsRequest'
 *           examples:
 *             complete_results:
 *               summary: Complete race results
 *               value:
 *                 results:
 *                   - sailNumber: "IRL1234"
 *                     yachtName: "Sea Spirit"
 *                     helmName: "John Doe"
 *                     crewNames: "Jane Doe, Bob Smith"
 *                     finishTime: "15:45:30"
 *                     position: 1
 *                     points: 1
 *                   - sailNumber: "IRL5678"
 *                     yachtName: "Wind Walker"
 *                     helmName: "Mary Johnson"
 *                     crewNames: "Tom Wilson"
 *                     finishTime: "15:47:15"
 *                     position: 2
 *                     points: 2
 *                   - sailNumber: "IRL9012"
 *                     yachtName: "Ocean Breeze"
 *                     helmName: "David Lee"
 *                     dnf: true
 *                     points: 4
 *             partial_results:
 *               summary: Results with DNS and DSQ
 *               value:
 *                 results:
 *                   - sailNumber: "IRL1111"
 *                     yachtName: "Storm Rider"
 *                     helmName: "Sarah Brown"
 *                     dns: true
 *                     notes: "Did not start due to equipment failure"
 *                   - sailNumber: "IRL2222"
 *                     yachtName: "Blue Wave"
 *                     helmName: "Mike Davis"
 *                     disqualified: true
 *                     notes: "Disqualified for rule infringement"
 *     responses:
 *       200:
 *         description: Race results submitted successfully
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
 *                         submittedCount:
 *                           type: integer
 *                           description: Number of results successfully submitted
 *                           example: 5
 *                         updatedCount:
 *                           type: integer
 *                           description: Number of existing results updated
 *                           example: 2
 *                         results:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/RaceResult'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/:id/results', validate(raceResultsSchema), submitRaceResults);

export default router;