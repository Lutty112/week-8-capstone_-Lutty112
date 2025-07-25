const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Message = require('../models/Message'); // Adjust path

jest.setTimeout(30000);

describe('Messages API', () => {
  let server;
  let token;
  const roomName = 'GeneralRoom';

  beforeAll(async () => {
    server = app.listen(0); // Single listen call
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
    await Message.deleteMany({});
  });

  it('should fetch all messages', async () => {
    const res = await request(app)
      .get(`/api/messages/${roomName}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomName,
        content: 'Hello, this is a test message',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Message sent successfully');
  });

  it('should fail to send a message without content', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ roomName });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Content is required');
  });

  it('should fail to fetch messages without token', async () => {
    const res = await request(app)
      .get(`/api/messages/${roomName}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'No token provided');
  });

  it('should fail to send a message without token', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ roomName, content: 'Test message' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'No token provided');
  });
});