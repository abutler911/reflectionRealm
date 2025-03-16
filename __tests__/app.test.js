const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 

beforeAll(async () => {
  // Connect to a test database or mock the database
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});