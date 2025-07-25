
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Polls API', () => {
  let server;
  let token;

  beforeAll(async () => {
    server = app.listen(0);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should fetch all polls', async () => {
    const res = await request(app)
      .get('/api/polls')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});