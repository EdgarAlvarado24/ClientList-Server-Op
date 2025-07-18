const { Sequelize, Op } = require('sequelize'); // Añade esta línea para importar Op
const Customer = require('../models/customer-models');

exports.searchCustomers = async (req, res) => {
  try {
    const { searchTerm, searchType } = req.query;
    
    // Validación de parámetros
    if (!searchTerm || !searchType) {
      return res.status(400).json({ error: 'Parámetros de búsqueda incompletos' });
    }

    let whereCondition = {};
    if (searchType === 'name') {
      whereCondition = {
        name: {
          [Op.iLike]: `%${searchTerm}%` // Cambia Sequelize.Op.iLike por Op.iLike
        }
      };
    } else if (searchType === 'phone') {
      whereCondition = {
        phone: {
          [Op.like]: `%${searchTerm}%` // Cambia Sequelize.Op.like por Op.like
        }
      };
    } else {
      return res.status(400).json({ error: 'Tipo de búsqueda no válido' });
    }

    const customers = await Customer.findAll({
      where: whereCondition,
      limit: 50
    });

    res.json(customers);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({ error: 'Error al buscar clientes', details: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Error al crear cliente', details: error.message });
  }
};