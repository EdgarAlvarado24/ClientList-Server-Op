const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'clientes',
  timestamps: false,
  freezeTableName: true
});

// Métodos de instancia (funcionan en una instancia específica del modelo)
Customer.prototype.getFullInfo = function() {
  return {
    id: this.id,
    nombre: this.nombre,
    telefono: this.telefono,
    email: this.email,
    address: this.address,
    infoCompleta: `${this.nombre} - ${this.telefono}`
  };
};

Customer.prototype.updateInfo = function(newData) {
  return this.update(newData);
};

// Métodos de clase (funcionan en el modelo completo)
Customer.getAllCustomers = async function() {
  try {
    return await this.findAll({
      limit: 100
    });
  } catch (error) {
    throw new Error(`Error al obtener clientes: ${error.message}`);
  }
};

Customer.searchCustomers = async function(searchTerm, searchType) {
  try {
    const { Op } = require('sequelize');
    
    if (!searchTerm || !searchType) {
      throw new Error('Parámetros de búsqueda incompletos');
    }

    let whereCondition = {};
    if (searchType === 'name') {
      whereCondition = {
        nombre: {
          [Op.iLike]: `%${searchTerm}%`
        }
      };
    } else if (searchType === 'phone') {
      whereCondition = {
        telefono: {
          [Op.like]: `%${searchTerm}%`
        }
      };
    } else {
      throw new Error('Tipo de búsqueda no válido');
    }

    return await this.findAll({
      where: whereCondition,
      limit: 50
    });
  } catch (error) {
    throw new Error(`Error al buscar clientes: ${error.message}`);
  }
};

Customer.createCustomer = async function(customerData) {
  try {
    const { nombre, telefono, email, address } = customerData;
    
    // Validación básica
    if (!nombre || !telefono) {
      throw new Error('El nombre y teléfono son obligatorios');
    }

    // Verificar duplicado
    const existingCustomer = await this.findOne({
      where: { telefono }
    });

    if (existingCustomer) {
      throw new Error('Ya existe un cliente con este número de teléfono');
    }

    // Crear cliente
    return await this.create({
      nombre,
      telefono,
      email: email || null,
      address: address || null
    });
  } catch (error) {
    throw new Error(`Error al crear cliente: ${error.message}`);
  }
};

Customer.updateCustomer = async function(id, updateData) {
  try {
    const customer = await this.findByPk(id);
    if (!customer) {
      throw new Error('Cliente no encontrado');
    }
    
    return await customer.update(updateData);
  } catch (error) {
    throw new Error(`Error al actualizar cliente: ${error.message}`);
  }
};

Customer.deleteCustomer = async function(id) {
  try {
    const customer = await this.findByPk(id);
    if (!customer) {
      throw new Error('Cliente no encontrado');
    }
    
    await customer.destroy();
    return { message: 'Cliente eliminado exitosamente' };
  } catch (error) {
    throw new Error(`Error al eliminar cliente: ${error.message}`);
  }
};

module.exports = Customer;