const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Auth Routes', () => {
  let server;

  beforeAll(async () => {
    server = app.listen(0);
    await mongoose.connect(process.env.MONGO_URI, {});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        phone: '1234567890',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('fullName', 'Test User');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.user).toHaveProperty('phone', '1234567890');
  });

  it('should login a registered user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        phone: '1234567890',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('fullName', 'Test User');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});