import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await User.deleteMany({ username: /testuser/ });
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser1', email: 'testuser1@example.com', password: 'testpass' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User registered.');
  });

  it('should not register duplicate user', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'testuser2', email: 'testuser2@example.com', password: 'testpass' });
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser2', email: 'testuser2@example.com', password: 'testpass' });
    expect(res.statusCode).toEqual(409);
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'testuser3', email: 'testuser3@example.com', password: 'testpass' });
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser3', password: 'testpass' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });
}); 