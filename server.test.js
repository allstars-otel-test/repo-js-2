const http = require('http');
const server = require('./server'); // Ensure server.js exports the server

const hostname = '127.0.0.1';
const port = 3000;

// Refactor the server to allow for manual start and shutdown
let httpServer;

// Start the server before running any tests
beforeAll((done) => {
  httpServer = server.listen(port, hostname, () => {
    console.log(`Test server running at http://${hostname}:${port}/`);
    done(); // Signal Jest to proceed with testing once the server is up
  });
});

// Shut down the server after all tests are done
afterAll((done) => {
  httpServer.close(() => {
    console.log('Test server closed');
    done(); // Signal Jest that cleaning up is complete and it can exit
  });
});

test('responds to requests', async () => {
  const response = await new Promise((resolve) => {
    http.get(`http://${hostname}:${port}/`, resolve);
  });

  expect(response.statusCode).toBe(200);

  let data = '';
  for await (const chunk of response) {
    data += chunk;
  }

  expect(data).toBe('Hello, World from Repo-2!\n');
});
