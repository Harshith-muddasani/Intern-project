import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import Offering from '../models/Offering.js';
import User from '../models/User.js';

let token, offeringId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({ username: 'offeringuser' });
  await request(app).post('/auth/register').send({ username: 'offeringuser', password: 'testpass' });
  const res = await request(app).post('/auth/login').send({ username: 'offeringuser', password: 'testpass' });
  token = res.body.token;
});

afterAll(async () => {
  await Offering.deleteMany({ username: 'offeringuser' });
  await User.deleteMany({ username: 'offeringuser' });
  await mongoose.connection.close();
});

describe('Offering Endpoints', () => {
  it('should create a new offering', async () => {
    const res = await request(app)
      .post('/offerings')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Flower', category: 'flowers', src: 'flower.png' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('Flower');
    offeringId = res.body._id;
  });

  it('should list offerings', async () => {
    const res = await request(app)
      .get('/offerings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete an offering', async () => {
    const res = await request(app)
      .delete(`/offerings/${offeringId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Offering deleted.');
  });
}); 