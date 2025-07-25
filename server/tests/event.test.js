const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Event = require('../models/Event'); // Adjust path

jest.setTimeout(30000); // Increase timeout for Atlas

describe('Events API', () => {
  let server;
  let token;

  beforeAll(async () => {
    server = app.listen(0);
    await mongoose.connect(process.env.MONGO_URI, {});
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
    await Event.deleteMany({});
  });

  it('should fetch all events', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Event');
  });

  it('should fetch a single event by ID', async () => {
    const createRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location',
      });
    const eventId = createRes.body._id;
    const res = await request(app)
      .get(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Test Event');
  });
});