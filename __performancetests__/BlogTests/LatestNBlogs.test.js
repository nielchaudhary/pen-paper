// Import necessary modules from k6
import http from 'k6/http';
import { sleep, group } from 'k6';

// Define global test options
export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp-up to 50 VUs in 30 seconds
        { duration: '1m', target: 50 },   // Stay at 50 VUs for 1 minute
        { duration: '30s', target: 0 },   // Ramp-down to 0 VUs in 30 seconds
    ],
    thresholds: {
        // Define your own thresholds based on acceptable response time
        http_req_duration: ['p(95)<500', 'p(99)<1000'],
    },

};


// Main test function
export default function () {
    const N = 10;
    const maxAcceptableTime = 2000;

    // Define a group for better result visualization in k6 output
    group('Performance Test', function () {
        const start = new Date().getTime();

        // Loop to simulate making N HTTP requests per virtual user
        for (let i = 0; i < N; i++) {
            const response = http.get('http://localhost:3000/blogs/latestNBlogs?N=1000');
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
