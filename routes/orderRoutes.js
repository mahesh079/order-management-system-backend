const express = require('express');
// middlewares
const { verifyToken } = require('../middlewares/authentication');
const upload = require('../middlewares/upload');
const knex = require('../mysqlConnection/mysqlConnection');

// Setting router
let router = express.Router();

// Route: Get all orders
router.get('/orders', verifyToken, async (req, res, next) => {
  try {
    const orders = await knex('orders').select('*');
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    next(error);
  }
});



// Route: Create new order
router.post('/create-new-order', upload.single('productImage'), async (req, res, next) => {
  const {
    customerName,
    email,
    contactNumber,
    address,
    productName,
    quantity
  } = req.body;

  const productImage = req.file?.filename;

  if (
    !customerName || !email || !contactNumber || !address ||
    !productName || !quantity || !productImage
  ) {
    return res.status(400).json({ error: 'All fields including image are required.' });
  }

  try {
    const [insertedId] = await knex('orders').insert({
      customerName,
      email,
      contactNumber,
      address,
      productName,
      quantity,
      productImage
    });

    // Emit to all connected clients that a new order was added
    const io = req.app.get('io'); // get io instance from app
    io.emit('newOrder', {
      id: insertedId,
      customerName,
      email,
      contactNumber,
      address,
      productName,
      quantity,
      productImage,
      createdAt: new Date().toISOString()
    });

    return res.status(200).json({ message: 'Order created and saved successfully.' });
  } catch (error) {
    console.error('Error saving order:', error.message);
    next(error)
  }
});

// DELETE /delete-order/:id
router.delete('/delete-order/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleted = await knex('orders').where({ id }).del();

    if (deleted === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error(' Error deleting order:', error.message);
    next(error)
  }
});

// Update order quantity
router.put('/orders/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;

  // Validate input
  if (!quantity || isNaN(quantity) || quantity < 1 || quantity > 100) {
    return res.status(400).json({ error: 'Quantity must be a number between 1 and 100.' });
  }

  try {
    const updated = await knex('orders')
      .where({ id })
      .update({ quantity });

    if (updated === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.status(200).json({ message: 'Quantity updated successfully.' });
  } catch (error) {
    console.error('Error updating quantity:', error.message);
    next(error)
  }
});

// GET /get-specific-orders/:name/:filterDate
router.get('/get-specific-orders', verifyToken, async (req, res, next) => {

  const { name, filterDate } = req.query;

  try {
    const query = knex('orders').orderBy('createdAt', 'desc');

    if (filterDate) {
      query.whereRaw('DATE(createdAt) = ?', [filterDate]);
    }

    if (name) {
      query.andWhere('productName', 'like', `%${name}%`);
    }

    const orders = await query;

    res.status(200).json(orders);
  } catch (error) {
    console.error(' Error fetching filtered orders: ', error.message);
    next(error)
  }
});

module.exports = router;
