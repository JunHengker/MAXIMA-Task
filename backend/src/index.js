const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const faker = require('faker');
const { pastiin, pastiin2 } = require('./validator.js');

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

app.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { customer_id: parseInt(id) },
    });
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/customers', pastiin, async (req, res) => {
  const { customer_name, email, city } = req.body;
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        customer_name,
        email,
        city,
      },
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.put('/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { customer_name, email, city } = req.body;
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { customer_id: parseInt(id) },
      data: {
        customer_name,
        email,
        city,
      },
    });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.delete('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.customer.delete({
      where: { customer_id: parseInt(id) },
    });
    res.status(204).end();
    console.log("Customers Deleted");
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.log("Customer Already Deleted");
  }
});

////////////////

app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        order_id: true,
        total_amount: true,
        customer: {
          select: { customer_id: true, customer_name: true },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { order_id: parseInt(id) },
      select: {
        order_id: true,
        total_amount: true,
        customer: {
          select: { customer_id: true,customer_name: true },
        },
      },
    });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/orders', pastiin2, async (req, res) => {
  const { customer_id, total_amount } = req.body;
  try {
    const newOrder = await prisma.order.create({
      data: {
        total_amount,
        customer: {
          connect: { customer_id },
        },
      },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { total_amount } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { order_id: parseInt(id) },
      data: { total_amount },
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.order.delete({
      where: { order_id: parseInt(id) },
    });
    res.status(204).end();
    console.log("Order Deleted");
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.log("Order Already Deleted");
  }
});

////seeding data faker.js
async function seedData() {
  try {
    await prisma.customer.createMany({
      data: Array.from({ length: 10 }).map(() => ({
        customer_name: faker.name.findName(),
        email: faker.internet.email(),
        city: faker.address.city(),
      })),
    });

    await prisma.order.createMany({
      data: Array.from({ length: 10 }).map(() => ({
        total_amount: faker.random.number({ min: 50, max: 200 }),
        customer_id: faker.random.number({ min: 1, max: 10 }),
      })),
    });
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// seedData();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
