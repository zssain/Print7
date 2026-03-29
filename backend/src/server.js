const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const designRoutes = require('./routes/designRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const accountRoutes = require('./routes/accountRoutes');
const omsRoutes = require('./routes/omsRoutes');
const paymentProfileRoutes = require('./routes/paymentProfileRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const designLibraryRoutes = require('./routes/designLibraryRoutes');

const { seedDatabase } = require('./data/seedData');
const mockDb = require('./data/mockDb');

const app = express();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

app.use(cors(config.corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(uploadsDir));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Print7 backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/seed', async (req, res) => {
  try {
    const { productSeedData } = require('./data/seedData');
    for (const product of productSeedData) {
      await mockDb.addProduct(product);
    }
    res.status(201).json({
      success: true,
      message: 'Database seeded successfully',
      count: productSeedData.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message,
    });
  }
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/oms', omsRoutes);
app.use('/api/payments', paymentProfileRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/library', designLibraryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  try {
    await seedDatabase();
    console.log('Database initialized with seed data');

    app.listen(PORT, () => {
      console.log(`Print7 backend server running on port ${PORT}`);
      console.log(`Environment: ${config.env}`);
      console.log(`CORS enabled for: ${config.frontendUrl}`);
      console.log(`Uploads directory: ${uploadsDir}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
