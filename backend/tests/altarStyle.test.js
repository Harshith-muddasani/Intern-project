import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import AltarStyle from '../models/AltarStyle.js';
import User from '../models/User.js';

let token, styleId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({ username: 'altaruser' });
  await request(app).post('/auth/register').send({ username: 'altaruser', password: 'testpass' });
  const res = await request(app).post('/auth/login').send({ username: 'altaruser', password: 'testpass' });
  token = res.body.token;
});

afterAll(async () => {
  await AltarStyle.deleteMany({ username: 'altaruser' });
  await User.deleteMany({ username: 'altaruser' });
  await mongoose.connection.close();
});

describe('Altar Style Endpoints', () => {
  it('should create a new altar style', async () => {
    const res = await request(app)
      .post('/altar-styles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Modern', value: 'modern', image: 'modern.jpg' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('Modern');
    styleId = res.body._id;
  });

  it('should list altar styles', async () => {
    const res = await request(app)
      .get('/altar-styles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete an altar style', async () => {
    const res = await request(app)
      .delete(`/altar-styles/${styleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Altar style deleted.');
  });
}); 