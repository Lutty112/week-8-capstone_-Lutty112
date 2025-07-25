const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Document = require('../models/Document'); // Adjust path

jest.setTimeout(30000);

describe('Documents API', () => {
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
    await Document.deleteMany({});
  });

  it('should fetch all documents', async () => {
    const res = await request(app)
      .get('/api/documents')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should upload a document', async () => {
    const res = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('Test document content'), 'test.txt');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Document uploaded successfully');
  });

  it('should delete a document', async () => {
    const uploadRes = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('Test document content'), 'test.txt');
    const documentId = uploadRes.body._id; // Adjust based on actual response
    const res = await request(app)
      .delete(`/api/documents/${documentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Document deleted successfully');
  });

  it('should fail to delete a document without token', async () => {
    const uploadRes = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('Test document content'), 'test.txt');
    const documentId = uploadRes.body._id;
    const res = await request(app)
      .delete(`/api/documents/${documentId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'No token provided');
  });

  it('should fail to upload a document without token', async () => {
    const res = await request(app)
      .post('/api/documents')
      .attach('file', Buffer.from('Test document content'), 'test.txt');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'No token provided');
  });

  it('should fail to fetch documents without token', async () => {
    const res = await request(app)
      .get('/api/documents');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'No token provided');
  });

  it('should fail to upload a document without file', async () => {
    const res = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'File is required');
  });

  it('should fail to delete a non-existent document', async () => {
    const res = await request(app)
      .delete('/api/documents/60d5f484f1b2c8b8f8e4e4e4')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Document not found');
  });
});