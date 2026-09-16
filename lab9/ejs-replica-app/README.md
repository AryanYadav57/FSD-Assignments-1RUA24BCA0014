# LinkedIn Profile Clone

A Full Stack web application that mimics a LinkedIn profile page. Built using **Node.js, Express.js, EJS, and Body Parser**.

## Project Objective
This application demonstrates dynamic routing and template rendering using EJS. A single `profile.ejs` template is used to display different users' information dynamically based on the URL parameter.

- `/profile/girish` → Displays Girish's profile
- `/profile/john` → Displays John's profile
- `/profile/emma` → Displays Emma's profile

## Technical Stack
- **Backend:** Node.js, Express.js
- **Templating Engine:** EJS
- **Middleware:** Body Parser
- **Frontend:** HTML, CSS, Bootstrap 5

## Setup Instructions

1. **Navigate to the project directory:**
   ```bash
   cd /Users/girishkailash/FSD_Assignments_0028/LAB-09/ejs-replica-app
   ```

2. **Install dependencies:**
   The required dependencies (`express`, `ejs`, `body-parser`) should already be installed. If not, run:
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   node app.js
   ```

4. **View the application:**
   Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

## Features Included
- **Home Page:** Displays all available profiles.
- **Dynamic Profile Page:** Renders different user data dynamically.
- **Not Found Page:** A custom error page for non-existent profiles.
- **Styling:** Uses Bootstrap 5 to maintain a professional, responsive layout similar to LinkedIn.
- **MVC-like Structure:** Clean separation of data (`data/users.js`), views (`views/`), and logic (`app.js`).
