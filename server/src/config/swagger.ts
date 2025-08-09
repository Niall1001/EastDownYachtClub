import swaggerJSDoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'East Down Yacht Club API',
      version: '1.0.0',
      description: 'RESTful API for East Down Yacht Club management system including events, races, stories, and file uploads. All endpoints are publicly accessible.',
      contact: {
        name: 'East Down Yacht Club',
        email: 'admin@eastdownyachtclub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.eastdownyachtclub.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        // Error response schemas
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates whether the request was successful'
            },
            data: {
              description: 'Response data (present on successful requests)'
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            error: {
              type: 'string',
              description: 'Error message (present on failed requests)'
            }
          },
          required: ['success']
        },
        PaginatedResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      minimum: 1,
                      description: 'Current page number'
                    },
                    limit: {
                      type: 'integer',
                      minimum: 1,
                      maximum: 100,
                      description: 'Number of items per page'
                    },
                    total: {
                      type: 'integer',
                      minimum: 0,
                      description: 'Total number of items'
                    },
                    totalPages: {
                      type: 'integer',
                      minimum: 0,
                      description: 'Total number of pages'
                    }
                  },
                  required: ['page', 'limit', 'total', 'totalPages']
                }
              }
            }
          ]
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              enum: [false]
            },
            error: {
              type: 'string',
              description: 'Validation error message'
            }
          },
          required: ['success', 'error']
        },
        

        // Event schemas
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the event'
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'Event title'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Event description'
            },
            event_type: {
              type: 'string',
              enum: ['social', 'regatta', 'series', 'racing', 'training', 'cruising', 'committee'],
              description: 'Type of event'
            },
            start_date: {
              type: 'string',
              format: 'date',
              description: 'Event start date'
            },
            end_date: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'Event end date (if multi-day event)'
            },
            start_time: {
              type: 'string',
              format: 'time',
              nullable: true,
              description: 'Event start time'
            },
            location: {
              type: 'string',
              maxLength: 200,
              nullable: true,
              description: 'Event location'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Event creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Event last update timestamp'
            }
          },
          required: ['id', 'title', 'event_type', 'start_date', 'created_at', 'updated_at']
        },
        CreateEventRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'Event title'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Event description'
            },
            eventType: {
              type: 'string',
              enum: ['social', 'regatta', 'series', 'racing', 'training', 'cruising', 'committee'],
              description: 'Type of event'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Event start date (ISO 8601 format)'
            },
            endDate: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'Event end date (ISO 8601 format)'
            },
            startTime: {
              type: 'string',
              nullable: true,
              description: 'Event start time (HH:MM format)'
            },
            location: {
              type: 'string',
              maxLength: 200,
              nullable: true,
              description: 'Event location'
            }
          },
          required: ['title', 'eventType', 'startDate']
        },
        UpdateEventRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'Event title'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Event description'
            },
            eventType: {
              type: 'string',
              enum: ['social', 'regatta', 'series', 'racing', 'training', 'cruising', 'committee'],
              description: 'Type of event'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Event start date (ISO 8601 format)'
            },
            endDate: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'Event end date (ISO 8601 format)'
            },
            startTime: {
              type: 'string',
              nullable: true,
              description: 'Event start time (HH:MM format)'
            },
            location: {
              type: 'string',
              maxLength: 200,
              nullable: true,
              description: 'Event location'
            }
          }
        },
        BoatEntry: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the boat entry'
            },
            boatName: {
              type: 'string',
              maxLength: 100,
              description: 'Name of the boat'
            },
            skipper: {
              type: 'string',
              maxLength: 100,
              description: 'Name of the skipper'
            },
            sailNumber: {
              type: 'string',
              maxLength: 20,
              description: 'Boat\'s sail number'
            },
            class: {
              type: 'string',
              maxLength: 100,
              description: 'Boat class'
            }
          },
          required: ['boatName', 'skipper', 'sailNumber', 'class']
        },

        // Story schemas
        Story: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the story'
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 300,
              description: 'Story title'
            },
            slug: {
              type: 'string',
              maxLength: 300,
              nullable: true,
              description: 'URL-friendly version of the title'
            },
            excerpt: {
              type: 'string',
              nullable: true,
              description: 'Brief summary of the story'
            },
            content: {
              type: 'string',
              description: 'Full story content'
            },
            story_type: {
              type: 'string',
              enum: ['news', 'racing', 'training', 'social', 'announcement'],
              default: 'news',
              description: 'Type of story'
            },
            featured_image_url: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL to the featured image'
            },
            gallery_images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri'
              },
              nullable: true,
              description: 'Array of gallery image URLs'
            },
            author_name: {
              type: 'string',
              maxLength: 100,
              nullable: true,
              description: 'Name of the story author'
            },
            published: {
              type: 'boolean',
              default: false,
              description: 'Whether the story is published'
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Story publication date'
            },
            event_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Associated event ID'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Story tags'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Story creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Story last update timestamp'
            }
          },
          required: ['id', 'title', 'content', 'story_type', 'published', 'tags', 'created_at', 'updated_at']
        },
        CreateStoryRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 300,
              description: 'Story title'
            },
            excerpt: {
              type: 'string',
              nullable: true,
              description: 'Brief summary of the story'
            },
            content: {
              type: 'string',
              description: 'Full story content'
            },
            storyType: {
              type: 'string',
              enum: ['news', 'racing', 'training', 'social', 'announcement'],
              description: 'Type of story'
            },
            featuredImageUrl: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'URL to the featured image'
            },
            galleryImages: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri'
              },
              description: 'Array of gallery image URLs'
            },
            authorName: {
              type: 'string',
              maxLength: 100,
              nullable: true,
              description: 'Name of the story author'
            },
            published: {
              type: 'boolean',
              default: false,
              description: 'Whether the story is published'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Story tags'
            },
            eventId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Associated event ID'
            }
          },
          required: ['title', 'content']
        },

        // Race schemas
        Race: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the race'
            },
            event_id: {
              type: 'string',
              format: 'uuid',
              description: 'Associated event ID'
            },
            yacht_class_id: {
              type: 'string',
              format: 'uuid',
              description: 'Yacht class ID'
            },
            race_number: {
              type: 'integer',
              minimum: 1,
              default: 1,
              description: 'Race number within the event'
            },
            race_date: {
              type: 'string',
              format: 'date',
              description: 'Date of the race'
            },
            start_time: {
              type: 'string',
              format: 'time',
              nullable: true,
              description: 'Race start time'
            },
            wind_direction: {
              type: 'string',
              maxLength: 100,
              nullable: true,
              description: 'Wind direction during the race'
            },
            wind_speed: {
              type: 'integer',
              minimum: 0,
              nullable: true,
              description: 'Wind speed during the race (knots)'
            },
            notes: {
              type: 'string',
              nullable: true,
              description: 'Additional race notes'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Race creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Race last update timestamp'
            }
          },
          required: ['id', 'event_id', 'yacht_class_id', 'race_number', 'race_date', 'created_at', 'updated_at']
        },
        CreateRaceRequest: {
          type: 'object',
          properties: {
            yachtClassId: {
              type: 'string',
              format: 'uuid',
              description: 'Yacht class ID'
            },
            raceNumber: {
              type: 'integer',
              minimum: 1,
              description: 'Race number within the event'
            },
            raceDate: {
              type: 'string',
              format: 'date',
              description: 'Date of the race (ISO 8601 format)'
            },
            startTime: {
              type: 'string',
              nullable: true,
              description: 'Race start time (HH:MM format)'
            },
            windDirection: {
              type: 'string',
              maxLength: 100,
              nullable: true,
              description: 'Wind direction during the race'
            },
            windSpeed: {
              type: 'integer',
              minimum: 0,
              nullable: true,
              description: 'Wind speed during the race (knots)'
            },
            notes: {
              type: 'string',
              nullable: true,
              description: 'Additional race notes'
            }
          },
          required: ['yachtClassId', 'raceDate']
        },
        RaceResult: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the race result'
            },
            race_id: {
              type: 'string',
              format: 'uuid',
              description: 'Associated race ID'
            },
            sail_number: {
              type: 'string',
              maxLength: 20,
              description: 'Boat\'s sail number'
            },
            yacht_name: {
              type: 'string',
              maxLength: 100,
              nullable: true,
              description: 'Name of the yacht'
            },
            helm_name: {
              type: 'string',
              maxLength: 100,
              nullable: true,
              description: 'Name of the helmsman'
            },
            crew_names: {
              type: 'string',
              nullable: true,
              description: 'Names of crew members'
            },
            finish_time: {
              type: 'string',
              format: 'time',
              nullable: true,
              description: 'Race finish time'
            },
            elapsed_time: {
              type: 'string',
              nullable: true,
              description: 'Elapsed time for the race'
            },
            corrected_time: {
              type: 'string',
              nullable: true,
              description: 'Corrected time after handicap'
            },
            position: {
              type: 'integer',
              minimum: 1,
              nullable: true,
              description: 'Final position in the race'
            },
            points: {
              type: 'integer',
              minimum: 0,
              nullable: true,
              description: 'Points scored in the race'
            },
            disqualified: {
              type: 'boolean',
              default: false,
              description: 'Whether the boat was disqualified'
            },
            dns: {
              type: 'boolean',
              default: false,
              description: 'Did Not Start'
            },
            dnf: {
              type: 'boolean',
              default: false,
              description: 'Did Not Finish'
            },
            retired: {
              type: 'boolean',
              default: false,
              description: 'Retired from the race'
            },
            notes: {
              type: 'string',
              nullable: true,
              description: 'Additional notes about the result'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Result creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Result last update timestamp'
            }
          },
          required: ['id', 'race_id', 'sail_number', 'created_at', 'updated_at']
        },
        SubmitRaceResultsRequest: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sailNumber: {
                    type: 'string',
                    maxLength: 20,
                    description: 'Boat\'s sail number'
                  },
                  yachtName: {
                    type: 'string',
                    maxLength: 100,
                    nullable: true,
                    description: 'Name of the yacht'
                  },
                  helmName: {
                    type: 'string',
                    maxLength: 100,
                    nullable: true,
                    description: 'Name of the helmsman'
                  },
                  crewNames: {
                    type: 'string',
                    nullable: true,
                    description: 'Names of crew members'
                  },
                  finishTime: {
                    type: 'string',
                    nullable: true,
                    description: 'Race finish time'
                  },
                  elapsedTime: {
                    type: 'string',
                    nullable: true,
                    description: 'Elapsed time for the race'
                  },
                  correctedTime: {
                    type: 'string',
                    nullable: true,
                    description: 'Corrected time after handicap'
                  },
                  position: {
                    type: 'integer',
                    minimum: 1,
                    nullable: true,
                    description: 'Final position in the race'
                  },
                  points: {
                    type: 'integer',
                    minimum: 0,
                    nullable: true,
                    description: 'Points scored in the race'
                  },
                  disqualified: {
                    type: 'boolean',
                    default: false,
                    description: 'Whether the boat was disqualified'
                  },
                  dns: {
                    type: 'boolean',
                    default: false,
                    description: 'Did Not Start'
                  },
                  dnf: {
                    type: 'boolean',
                    default: false,
                    description: 'Did Not Finish'
                  },
                  retired: {
                    type: 'boolean',
                    default: false,
                    description: 'Retired from the race'
                  },
                  notes: {
                    type: 'string',
                    nullable: true,
                    description: 'Additional notes about the result'
                  }
                },
                required: ['sailNumber']
              },
              description: 'Array of race results'
            }
          },
          required: ['results']
        },

        // File upload schemas
        FileUploadResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    filename: {
                      type: 'string',
                      description: 'Generated filename for the uploaded file'
                    },
                    originalname: {
                      type: 'string',
                      description: 'Original filename'
                    },
                    mimetype: {
                      type: 'string',
                      description: 'MIME type of the uploaded file'
                    },
                    size: {
                      type: 'integer',
                      description: 'File size in bytes'
                    },
                    url: {
                      type: 'string',
                      format: 'uri',
                      description: 'URL to access the uploaded file'
                    }
                  },
                  required: ['filename', 'originalname', 'mimetype', 'size', 'url']
                }
              }
            }
          ]
        },

        // Yacht Class schema
        YachtClass: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the yacht class'
            },
            name: {
              type: 'string',
              maxLength: 100,
              description: 'Name of the yacht class'
            },
            handicap_system: {
              type: 'string',
              maxLength: 50,
              nullable: true,
              description: 'Handicap system used for this class'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yacht class creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yacht class last update timestamp'
            }
          },
          required: ['id', 'name', 'created_at', 'updated_at']
        }
      },
      responses: {
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    enum: [false]
                  },
                  error: {
                    type: 'string',
                    example: 'Resource not found'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    enum: [false]
                  },
                  error: {
                    type: 'string',
                    example: 'Internal server error'
                  }
                }
              }
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        SearchParam: {
          name: 'search',
          in: 'query',
          description: 'Search term to filter results',
          required: false,
          schema: {
            type: 'string'
          }
        },
        TypeParam: {
          name: 'type',
          in: 'query',
          description: 'Filter by type',
          required: false,
          schema: {
            type: 'string'
          }
        },
        PublishedParam: {
          name: 'published',
          in: 'query',
          description: 'Filter by published status',
          required: false,
          schema: {
            type: 'boolean'
          }
        },
        StartDateParam: {
          name: 'startDate',
          in: 'query',
          description: 'Filter by start date (ISO 8601 format)',
          required: false,
          schema: {
            type: 'string',
            format: 'date'
          }
        },
        EndDateParam: {
          name: 'endDate',
          in: 'query',
          description: 'Filter by end date (ISO 8601 format)',
          required: false,
          schema: {
            type: 'string',
            format: 'date'
          }
        }
      }
    },
    tags: [
      {
        name: 'Events',
        description: 'Event management endpoints'
      },
      {
        name: 'Stories',
        description: 'Story/news management endpoints'
      },
      {
        name: 'Races',
        description: 'Race and race results management endpoints'
      },
      {
        name: 'Upload',
        description: 'File upload endpoints'
      },
      {
        name: 'System',
        description: 'System health and monitoring endpoints'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/app.ts'
  ]
};

export const specs = swaggerJSDoc(options);