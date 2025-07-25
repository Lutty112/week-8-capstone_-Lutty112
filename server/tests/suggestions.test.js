
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust path
const User = require('../models/User');

describe('Suggestions API', () => {
  let server;
  let token;

    beforeAll(async () => {
    // Start server
    server = app.listen(0); // Use random port to avoid conflicts
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Register a test user and get token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        phone: '1234567890',
        email: 'test@example.com',
        password: 'password123',
      });
    token = res.body.token;
  });

  afterAll(async () => {
    // Close server and database connection
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    // Clean up database
    await User.deleteMany({});
  });

  it('should fetch all suggestions', async () => {
    const res = await request(app)
      .get('/api/suggestions')
      .set('Authorization', `Bearer ${token}`); // Include token
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});