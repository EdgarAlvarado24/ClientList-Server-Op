const { Sequelize, Op } = require('sequelize'); // Añade esta línea para importar Op
const Customer = require('../models/customer-models');

exports.getAllCustomers = async (req, res) => {
  try {
    // Usando el método del modelo
    const customers = await Customer.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ error: 'Error al obtener clientes', details: error.message });
  }
};

exports.searchCustomers = async (req, res) => {
  try {
    const { searchTerm, searchType } = req.query;
    
    // Usando el método del modelo
    const customers = await Customer.searchCustomers(searchTerm, searchType);
    res.json(customers);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({ error: 'Error al buscar clientes', details: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    // Usando el método del modelo
    const customer = await Customer.createCustomer(req.body);
    res.status(201).json({
      message: 'Cliente creado exitosamente',
      customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    
    if (error.message.includes('obligatorios')) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes', 
        details: error.message 
      });
    }
    
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({ 
        error: 'Cliente ya existe', 
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Error al crear cliente', 
      details: error.message 
    });
  }
};

exports.editCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Usando el método del modelo
    const customer = await Customer.updateCustomer(id, updateData);
    res.json({
      message: 'Cliente actualizado exitosamente',
      customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ 
        error: 'Cliente no encontrado', 
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Error al actualizar cliente', 
      details: error.message 
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Usando el método del modelo
    const result = await Customer.deleteCustomer(id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting customer:', error);
    
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ 
        error: 'Cliente no encontrado', 
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Error al eliminar cliente', 
      details: error.message 
    });
  }
};