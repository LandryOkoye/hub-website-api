const Joi = require("joi");


// ____ Fixed Categories List ____

const EVENT_CATEGORIES = [
  "Conference",
  "Workshop",
  "Meetup",
  "Webinar",
  "Hackathon",
  "Summit",
  "Training",
  "Networking",
  "Other",
];


const customFieldSchema = Joi.object({

  field_id: Joi.string(),

  label: Joi.string().min(2).max(255).required().messages({
    "string.empty": "Each custom field must have a label",
    "any.required": "Each custom field must have a label",
  }),

  type: Joi.string()
    .valid("dropdown", "checkbox", "textarea")
    .required()
    .messages({
      "any.only":
        'Field type must be one of: "dropdown", "checkbox", "textarea"',
      "any.required": "Each custom field must have a type",
    }),

  required: Joi.boolean().default(false),

  options: Joi.when("type", {
    is: Joi.valid("dropdown", "checkbox"),
    then: Joi.array()
      .items(Joi.string().min(1))
      .min(2)
      .required()
      .messages({
        "array.min":
          'Dropdown and checkbox fields must have at least 2 options',
        "any.required":
          'Options are required for "dropdown" and "checkbox" field types',
      }),
    otherwise: Joi.array().items(Joi.string()).default([]),
  }),
});


const createEventValidation = Joi.object({
  event_name: Joi.string().min(3).max(255).required().messages({
    "string.empty": "Event name is required",
    "string.min": "Event name must be at least 3 characters",
    "any.required": "Event name is required",
  }),

  description: Joi.string().min(10).required().messages({
    "string.empty": "Event description is required",
    "string.min": "Description must be at least 10 characters",
    "any.required": "Description is required",
  }),

  category: Joi.string()
    .valid(...EVENT_CATEGORIES)
    .required()
    .messages({
      "any.only": `Category must be one of: ${EVENT_CATEGORIES.join(", ")}`,
      "any.required": "Category is required",
    }),

  location: Joi.string().min(3).max(500).required().messages({
    "string.empty": "Event location is required",
    "any.required": "Location is required",
  }),

  start_datetime: Joi.string().isoDate().required().messages({
    "string.isoDate":
      'start_datetime must be a valid ISO 8601 date (e.g. "2026-06-10T09:00:00Z")',
    "any.required": "Start date/time is required",
  }),

  end_datetime: Joi.string().isoDate().required().messages({
    "string.isoDate":
      'end_datetime must be a valid ISO 8601 date (e.g. "2026-06-10T17:00:00Z")',
    "any.required": "End date/time is required",
  }),

  status: Joi.string().valid("published", "closed").default("published"),

  custom_fields: Joi.alternatives()
    .try(
      Joi.array().items(customFieldSchema).default([]),
      Joi.string()
    )
    .default([]),
});


const updateEventValidation = Joi.object({
  event_name: Joi.string().min(3).max(255),
  description: Joi.string().min(10),
  category: Joi.string().valid(...EVENT_CATEGORIES),
  location: Joi.string().min(3).max(500),
  start_datetime: Joi.string().isoDate(),
  end_datetime: Joi.string().isoDate(),
  status: Joi.string().valid("published", "closed"),
  custom_fields: Joi.alternatives().try(
    Joi.array().items(customFieldSchema),
    Joi.string()
  ),
});


const createRegistrationValidation = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    "string.empty": "Full name is required",
    "any.required": "Full name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "A valid email address is required",
    "any.required": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^(\+234|0)[7-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Nigerian number (e.g. 08012345678 or +2348012345678)",
      "any.required": "Phone number is required",
    }),

  responses: Joi.object()
    .pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string().allow(""),
        Joi.array().items(Joi.string())
      )
    )
    .default({}),
});

module.exports = { createEventValidation, updateEventValidation, createRegistrationValidation, EVENT_CATEGORIES };
