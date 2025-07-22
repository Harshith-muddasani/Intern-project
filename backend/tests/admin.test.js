import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({ username: 'admin' });
  await request(app).post('/auth/register').send({ username: 'admin', email: 'admin@example.com', password: 'adminpass' });
  const res = await request(app).post('/auth/login').send({ username: 'admin', password: 'adminpass' });
  token = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({ username: 'admin' });
  await mongoose.connection.close();
});

describe('Admin Endpoints', () => {
  it('should get all users and sessions', async () => {
    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.users).toBeDefined();
    expect(res.body.sessions).toBeDefined();
  });

  it('should forbid non-admin users', async () => {
    await request(app).post('/auth/register').send({ username: 'notadmin', email: 'notadmin@example.com', password: 'testpass' });
    const loginRes = await request(app).post('/auth/login').send({ username: 'notadmin', password: 'testpass' });
    const notAdminToken = loginRes.body.token;
    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${notAdminToken}`);
    expect(res.statusCode).toEqual(403);
  });
}); 