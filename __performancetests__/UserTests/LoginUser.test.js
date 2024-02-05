import http from 'k6/http';
import {  group } from 'k6';

export const options = {
    vus: 50,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<500', 'p(99)<1000'],
    },
};

const loginData = {
    username: 'your_username',
    password: 'your_password',
};

// Scenario: Login Users
export default function () {

    // Use a group for better result visualization in k6 output
    group('Login Users Performance Test', function () {
        // Loop to simulate 50 users logging in simultaneously
        for (let i = 0; i < 50; i++) {
            // Make an HTTP request to log in
            const response = http.post('http://localhost:3000/users/loginUser', loginData);
        }
    });



}
