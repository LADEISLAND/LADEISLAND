const express = require('express');
const SolarSystemData = require('../models/SolarSystemData');
const { validateRequest, schemas } = require('../middleware/validation');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get default solar system data
router.get('/default', async (req, res) => {
  try {
    const defaultData = SolarSystemData.getDefaultSolarSystem();
    res.json(defaultData);
  } catch (error) {
    console.error('Default solar system error:', error);
    res.status(500).json({ error: 'Failed to get default solar system data' });
  }
});

// Get solar system data by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const solarSystem = await SolarSystemData.findById(id);
    
    if (!solarSystem) {
      return res.status(404).json({ error: 'Solar system not found' });
    }
    
    res.json(solarSystem);
  } catch (error) {
    console.error('Solar system fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch solar system data' });
  }
});

// Create new solar system configuration
router.post('/', optionalAuth, validateRequest(schemas.solarSystemUpdate), async (req, res) => {
  try {
    const solarSystemData = new SolarSystemData(req.body);
    await solarSystemData.save();
    
    res.status(201).json({
      message: 'Solar system configuration created',
      id: solarSystemData._id,
      data: solarSystemData
    });
  } catch (error) {
    console.error('Solar system creation error:', error);
    res.status(500).json({ error: 'Failed to create solar system configuration' });
  }
});

// Update solar system configuration
router.put('/:id', optionalAuth, validateRequest(schemas.solarSystemUpdate), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, version: { $inc: 1 } };
    
    const solarSystem = await SolarSystemData.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!solarSystem) {
      return res.status(404).json({ error: 'Solar system not found' });
    }
    
    res.json({
      message: 'Solar system updated successfully',
      data: solarSystem
    });
  } catch (error) {
    console.error('Solar system update error:', error);
    res.status(500).json({ error: 'Failed to update solar system' });
  }
});

// Get planet-specific information
router.get('/planet/:planetName', async (req, res) => {
  try {
    const { planetName } = req.params;
    const defaultData = SolarSystemData.getDefaultSolarSystem();
    
    const planet = defaultData.planets.find(p => 
      p.name.toLowerCase() === planetName.toLowerCase()
    );
    
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
    }
    
    // Add additional planet information
    const planetInfo = {
      ...planet,
      facts: [
        `${planet.name} is ${planet.size} times the size of Earth`,
        `It orbits at a distance of ${planet.distance} astronomical units`,
        `Orbital speed: ${planet.orbitalSpeed}x Earth's speed`,
        `Rotation speed: ${planet.rotationSpeed}x Earth's speed`
      ]
    };
    
    res.json(planetInfo);
  } catch (error) {
    console.error('Planet info error:', error);
    res.status(500).json({ error: 'Failed to get planet information' });
  }
});

// Get all planets with basic info
router.get('/planets/list', async (req, res) => {
  try {
    const defaultData = SolarSystemData.getDefaultSolarSystem();
    
    const planetsList = defaultData.planets.map(planet => ({
      name: planet.name,
      color: planet.color,
      size: planet.size,
      distance: planet.distance,
      orbitalSpeed: planet.orbitalSpeed,
      rotationSpeed: planet.rotationSpeed
    }));
    
    res.json({ planets: planetsList });
  } catch (error) {
    console.error('Planets list error:', error);
    res.status(500).json({ error: 'Failed to get planets list' });
  }
});

// Update specific planet
router.put('/planet/:planetName', optionalAuth, async (req, res) => {
  try {
    const { planetName } = req.params;
    const updateData = req.body;
    
    // This would typically update a specific solar system configuration
    // For now, we'll return the updated planet data
    const defaultData = SolarSystemData.getDefaultSolarSystem();
    const planetIndex = defaultData.planets.findIndex(p => 
      p.name.toLowerCase() === planetName.toLowerCase()
    );
    
    if (planetIndex === -1) {
      return res.status(404).json({ error: 'Planet not found' });
    }
    
    const updatedPlanet = {
      ...defaultData.planets[planetIndex],
      ...updateData
    };
    
    res.json({
      message: 'Planet updated successfully',
      planet: updatedPlanet
    });
  } catch (error) {
    console.error('Planet update error:', error);
    res.status(500).json({ error: 'Failed to update planet' });
  }
});

// Get solar system statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const defaultData = SolarSystemData.getDefaultSolarSystem();
    
    const stats = {
      totalPlanets: defaultData.planets.length,
      totalMoons: defaultData.planets.reduce((sum, planet) => 
        sum + (planet.moons ? planet.moons.length : 0), 0
      ),
      averageDistance: defaultData.planets.reduce((sum, planet) => 
        sum + planet.distance, 0
      ) / defaultData.planets.length,
      largestPlanet: defaultData.planets.reduce((max, planet) => 
        planet.size > max.size ? planet : max
      ),
      smallestPlanet: defaultData.planets.reduce((min, planet) => 
        planet.size < min.size ? planet : min
      ),
      sunInfo: defaultData.sun
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get solar system statistics' });
  }
});

module.exports = router;