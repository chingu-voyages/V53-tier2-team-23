const Allergen = require('../models/allergen.models');

class AllergenController {
  async createAllergen(req, res) {
    const { allergenName } = req.body;

    if (!allergenName) {
      return res.status(400).send('Allergen name is required');
    }

    // need to add error message if allergen already exist

    try {
      const newAllergen = await Allergen.create({ allergenName });
      res.status(200).send(newAllergen);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = AllergenController;
