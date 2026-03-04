const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
    it('should return status UP', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('UP');
    });
});