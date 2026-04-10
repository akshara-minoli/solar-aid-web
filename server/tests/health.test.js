import request from 'supertest';
import { app } from '../server.js';
import mongoose from 'mongoose';

describe('Health Check API', () => {
  it('should return 200 and report healthy status', async () => {
    const res = await request(app).get('/api/health');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'Server is healthy');
    // It should report Connected since we initialized mongoose in setup.js
    expect(res.body).toHaveProperty('database', 'Connected');
  });
});
