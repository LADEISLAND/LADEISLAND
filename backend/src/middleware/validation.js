const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  chatMessage: Joi.object({
    content: Joi.string().max(2000).required(),
    sessionId: Joi.string().required(),
    context: Joi.object({
      solarSystemState: Joi.object(),
      userLocation: Joi.object()
    }).optional()
  }),
  
  solarSystemUpdate: Joi.object({
    planets: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      color: Joi.string().required(),
      size: Joi.number().min(0).required(),
      distance: Joi.number().min(0).required(),
      orbitalSpeed: Joi.number().min(0).optional(),
      rotationSpeed: Joi.number().min(0).optional()
    })).optional(),
    settings: Joi.object({
      animationSpeed: Joi.number().min(0.1).max(5).optional(),
      showOrbits: Joi.boolean().optional(),
      showLabels: Joi.boolean().optional(),
      cameraPosition: Joi.object({
        x: Joi.number().optional(),
        y: Joi.number().optional(),
        z: Joi.number().optional()
      }).optional()
    }).optional()
  })
};

module.exports = { validateRequest, schemas };