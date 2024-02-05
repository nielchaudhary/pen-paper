import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp-up to 50 VUs in 30 seconds
        { duration: '1m', target: 50 },   // Stay at 50 VUs for 1 minute
        { duration: '30s', target: 0 },   // Ramp-down to 0 VUs in 30 seconds
    ],
    thresholds: {
        http_req_duration: ['p(95)<500', 'p(99)<1000'],
    },
};

const N = 5;  // Number of requests per virtual user
const maxAcceptableTime = 2000;

// Scenario: Search Blogs
export default function () {
    const searchQuery = 'Machine Learning'; // Replace with an actual search query

    // Define a group for better result visualization in k6 output
    group('Search Blogs Performance Test', function () {
        const start = new Date().getTime();

        // Loop to simulate making N HTTP requests per virtual user
        for (let i = 0; i < N; i++) {
            // Make an HTTP request to search for blogs
            const response = http.get(`http://localhost:3000/blogs/searchBlogs?search=${searchQuery}`);

            // Check if the response status is 200
            check(response, {
                'Status is 200': (r) => r.status === 200,
            });
        }

        const end = new Date().getTime();

        const elapsed = end - start;
        // Check if the elapsed time exceeds the maximum acceptable time
        if (elapsed > maxAcceptableTime) {
            console.error(`Performance test failed. Elapsed time: ${elapsed}ms`);
        }

        // Sleep between iterations if needed
        sleep(1);
    });
}
