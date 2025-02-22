# E-Commerce CRUD App (Polish Website)

This is a test e-commerce CRUD application featuring musical articles related to Maurice Ravel as default products and events.

## Features
- Add items to your cart and place orders.
- Manage content easily through an intuitive admin panel.
- State management with Redux.
- Data stored in MariaDB running on a MySQL server.

## Installation & Setup
### Prerequisites
- Node.js & npm
- MySQL server
- Required dependencies (see `package.json`)

### Steps
1. Install dependencies for both frontend and backend:
   ```sh
   npm install # (in both /hapi and /react)
   ```
2. Set up the database:
   - Start your MySQL server.
   - Input the server details into a .env file inside the /hapi subdirectory (see .env.example for the expected values)
3. Start the development servers:
   ```sh
   npm run dev # (in both /hapi and /react)
   ```

## Live Demo
Visit [http://209.97.139.66](http://209.97.139.66) to see the app in action (hosted on a DigitalOcean VPS).

**Note:** The website is in Polish.