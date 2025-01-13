const { describe, it } = require("mocha");
const { expect } = require("chai");

const { app, server } = require('../index');
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

let baseUrl; // Base URL for your backend

describe('Student Search API', () => {

  before(async () => {
    const { address, port } = await server.address();
    baseUrl = `http://${address === "::" ? "localhost" : address}:${port}`;
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  // Test Suite for searching students
  describe('GET /students/search', () => {
    it('should return student details by ID', (done) => {
      chai.request(baseUrl)
        .get('/api/students/search') // Adjust the endpoint path as per your routing
        .query({ query: '1' }) // Simulating ID-based search
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.student).to.have.property('studentID');
          expect(res.body.student).to.have.property('name', 'Alice Johnson');
          expect(res.body.classes).to.be.an('array');
          expect(res.body.classes[0]).to.have.property('subject', 'Math');
          done();
        });
    });

    it('should return student details by name', (done) => {
      chai.request(baseUrl)
        .get('/api/students/search') // Adjust the endpoint path as per your routing
        .query({ query: 'bob' }) // Simulating name-based search (case insensitive)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.student).to.have.property('studentID'); // Ensure it has an ID
          expect(res.body.student).to.have.property('name', 'Bob Smith');
          expect(res.body.classes).to.be.an('array');
          expect(res.body.classes[0]).to.have.property('subject', 'Science');
          done();
        });
    });

    it('should return 400 for missing query parameter', (done) => {
      chai.request(baseUrl)
        .get('/api/students/search') // Adjust the endpoint path as per your routing
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error', 'Query parameter is required');
          done();
        });
    });

    it('should return 404 for non-existent student', (done) => {
      chai.request(baseUrl)
        .get('/api/students/search') // Adjust the endpoint path as per your routing
        .query({ query: '99' }) // Simulating non-existent ID
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error', 'No student found with that ID or name');
          done();
        });
    });
  });
});
