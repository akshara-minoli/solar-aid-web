import request from 'supertest';
import { app } from '../server.js';
import User from '../models/User.js';

describe('Authentication API', () => {
  const testUser = {
    fullName: 'Test User',
    email: 'testuser@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    phone: '1234567890'
  };

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully and return 201', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('fullName', testUser.fullName);
      
      // Verify user was saved to the test DB
      const userInDb = await User.findOne({ email: testUser.email });
      expect(userInDb).toBeTruthy();
      expect(userInDb.fullName).toBe(testUser.fullName);
    });

    it('should fail with 400 when missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'incomplete@example.com'
          // Missing password, fullName, etc.
        });

      // Express validator usually yields 400
      expect(res.status).toBe(400); 
    });

    it('should fail if email is already registered', async () => {
      // First registration
      await request(app).post('/api/auth/signup').send(testUser);
      
      // Second Registration with same email
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/exists|already/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register user before each login test
      await request(app).post('/api/auth/signup').send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should fail with 401/400 for invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword1!'
        });

      // Generally a 401 or 400 for invalid credentials. Let's check for either. 
      // Most of the time it's 401 for unauthorized, but could be 400.
      expect([400, 401]).toContain(res.status);
    });
  });
});

