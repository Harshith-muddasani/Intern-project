import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import Session from '../models/Session.js';
import User from '../models/User.js';

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({ username: 'sessionuser' });
  await request(app).post('/auth/register').send({ username: 'sessionuser', password: 'testpass' });
  const res = await request(app).post('/auth/login').send({ username: 'sessionuser', password: 'testpass' });
  token = res.body.token;
});

afterAll(async () => {
  await Session.deleteMany({ username: 'sessionuser' });
  await User.deleteMany({ username: 'sessionuser' });
  await mongoose.connection.close();
});

describe('Session Endpoints', () => {
  it('should save a new session', async () => {
    const res = await request(app)
      .post('/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Session',
        items: [{ name: 'item1' }],
        altarStyle: 'classic',
        timestamp: Date.now()
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Session saved.');
  });

  it('should list sessions', async () => {
    const res = await request(app)
      .get('/sessions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete a session', async () => {
    const res = await request(app)
      .delete('/sessions/Test Session')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Session deleted.');
  });
}); 