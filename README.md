---
description: 'Repo link: https://github.com/engagingnewsproject/fb-study'
---

# README

## Project Overview

This project is a React-based web application designed for conducting Facebook-related research studies. It utilizes Firebase for data management and includes features for logging user interactions and responses.

### Links
[cme-facebook-2 Firebase Project](https://console.firebase.google.com/u/0/project/cme-facebook-2/overview) | [Big Query Google Console](https://console.cloud.google.com/bigquery?orgonly=true&project=cme-facebook-2&supportedpurview=project) | [CME Facebook Study Looker Studio Report](https://lookerstudio.google.com/reporting/aa5f3b52-40a0-4c0a-bfda-c53323210157)

### Key Features
- React-based frontend interface
- Firebase integration for data storage and management
- User interaction logging system
- Component-based architecture for modular development
- Responsive design for cross-device compatibility

### Firebase Integration
The application leverages Firebase as its backend infrastructure:
- **Firestore Database**: Stores structured data from user interactions and study responses
- **Authentication**: Manages user sessions and identity (if applicable)
- **Cloud Functions**: Processes data and triggers events based on user actions
- **Real-time Updates**: Enables immediate data synchronization across clients
- **Scalable Infrastructure**: Handles varying loads during research studies

### User Interaction Logging System
The logging system captures detailed information about how participants interact with the study:
- **Event Tracking**: Records specific user actions (clicks, views, time spent, etc.)
- **Session Management**: Groups interactions within user sessions
- **Timestamping**: Adds precise timing data to all logged events
- **Device Information**: Captures contextual data about user environment
- **Data Export**: Provides mechanisms for exporting logs for analysis
- **Privacy Compliance**: Implements appropriate data handling practices

The logging system is implemented in the `src/logging/` directory and integrates with Firebase for data persistence.

### Project Structure
```
src/
├── components/     # React components
├── logging/       # Logging functionality
├── img/           # Image assets
├── css/          # Styling files
├── util/         # Utility functions
├── config.js     # Configuration settings
└── index.js      # Application entry point
```

### Technologies Used
- React 16
- Firebase 7
- Axios for HTTP requests
- UUID for unique identifiers
- TimeAgo.js for timestamp formatting

### Data Processing Scripts

#### transform.js
A Node.js script that transforms Firebase Realtime Database exports into BigQuery-compatible format.

**Purpose:**
- Converts nested Firebase JSON data into flattened JSONL format
- Preserves all user interaction data and metadata
- Prepares data for BigQuery import and analysis

**Usage:**
```bash
# 1. Export your Firebase data as JSON
# 2. Place the export file in the project root as 'cme-facebook-2-export.json'
# 3. Run the transformation script
node transform.js
# 4. Find the output file 'transformed-data.jsonl'
```

**Input Format:** Firebase JSON export containing:
- User interaction logs
- Varied post information
- Engagement metrics
- User metadata

**Output Format:** JSONL (JSON Lines) with each line containing:
- id: unique identifier (userID|timestamp)
- ip_address: user's IP address
- message: interaction description
- time: timestamp
- type: interaction type
- user: user identifier
- post_id: related post identifier
- varied_post_in_feed: experimental post data including:
  - community metrics (likes, shares)
  - content details (caption, image)
  - metadata (endorsement, politics, type)

**Dependencies:**
- Node.js
- fs (built-in file system module)

#### Setup

Before you run `npm install` [upgrade React](https://betterprogramming.pub/upgrade-create-react-app-based-projects-to-version-4-cra-4-d7962aee11a6) by running `npm install --save react-scripts@latest`

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000/) to view it in the browser.

### Sync data between Firebase, BigQuery, and Looker Studio

To automatically sync data between Firebase, BigQuery, and Looker Studio:
> Requires the [Blaze Plan](https://firebase.google.com/pricing?hl=en&authuser=0&_gl=1*l4fb7q*_ga*MTE2MzIxNDM5OS4xNzQxNzAwODIx*_ga_CW55HF8NVT*MTc0MTcxMDkyMi4yLjEuMTc0MTcxMDkzNC40OC4wLjA.) for the firebase project.

- Use the "Export Collections to BigQuery" extension
- Go to Firebase Console > Extensions
- Install "Export Collections to BigQuery"
- This will automatically sync your Realtime Database to BigQuery
