const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  distance: {
    type: Number,
    required: true,
    min: 0
  },
  orbitalSpeed: {
    type: Number,
    default: 1
  },
  rotationSpeed: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    default: ''
  },
  facts: [{
    type: String
  }],
  moons: [{
    name: String,
    size: Number,
    distance: Number
  }]
});

const solarSystemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Our Solar System'
  },
  planets: [planetSchema],
  sun: {
    color: {
      type: String,
      default: '#ffff00'
    },
    size: {
      type: Number,
      default: 15
    },
    intensity: {
      type: Number,
      default: 1.5
    }
  },
  settings: {
    animationSpeed: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 5
    },
    showOrbits: {
      type: Boolean,
      default: true
    },
    showLabels: {
      type: Boolean,
      default: true
    },
    cameraPosition: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 40 },
      z: { type: Number, default: 120 }
    }
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Static method to get default solar system
solarSystemSchema.statics.getDefaultSolarSystem = function() {
  return {
    name: 'Our Solar System',
    planets: [
      { name: 'Mercury', color: '#b1b1b1', size: 0.38, distance: 12, orbitalSpeed: 1.5, rotationSpeed: 1.2 },
      { name: 'Venus', color: '#e5c27b', size: 0.95, distance: 18, orbitalSpeed: 1.2, rotationSpeed: 0.8 },
      { name: 'Earth', color: '#2d5f9b', size: 1.0, distance: 25, orbitalSpeed: 1.0, rotationSpeed: 1.0 },
      { name: 'Mars', color: '#d14e28', size: 0.53, distance: 32, orbitalSpeed: 0.8, rotationSpeed: 1.1 },
      { name: 'Jupiter', color: '#d9a066', size: 11.2, distance: 52, orbitalSpeed: 0.4, rotationSpeed: 2.4 },
      { name: 'Saturn', color: '#d9c39a', size: 9.45, distance: 72, orbitalSpeed: 0.3, rotationSpeed: 2.2 },
      { name: 'Uranus', color: '#91c7d9', size: 4.0, distance: 92, orbitalSpeed: 0.2, rotationSpeed: 1.4 },
      { name: 'Neptune', color: '#4062b6', size: 3.9, distance: 110, orbitalSpeed: 0.15, rotationSpeed: 1.6 }
    ],
    sun: {
      color: '#ffff00',
      size: 15,
      intensity: 1.5
    },
    settings: {
      animationSpeed: 1,
      showOrbits: true,
      showLabels: true,
      cameraPosition: { x: 0, y: 40, z: 120 }
    },
    version: 1
  };
};

module.exports = mongoose.model('SolarSystemData', solarSystemSchema);