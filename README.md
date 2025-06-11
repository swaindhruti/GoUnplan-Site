# UNPLAN - Next-Gen Travel Experience Platform

## Overview

UNPLAN is a modern travel platform that helps users discover, plan, and book unique travel experiences. Built with cutting-edge technologies, UNPLAN offers a seamless user experience for both travelers and hosts.

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes
- **Authentication**: AuthJS (NextAuth.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Features

- **User Authentication**: Secure login and signup with email/password
- **User Profiles**: Personalized user profiles with travel preferences
- **Experience Discovery**: Browse and search for unique travel experiences
- **Booking System**: Seamless booking and payment processing
- **Host Portal**: Tools for hosts to list and manage their offerings
- **Reviews & Ratings**: Community-driven quality control

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- npm or yarn

### Environment Setup

1. Clone the repository

   ```bash
   git clone https://github.com/swaindhruti/project-unplan-travel.git
   cd project-unplan-travel
   ```

2. Install dependencies

   ```bash
   yarn install
   ```

3. Create a .env file in the root directory with the following variables:

   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/unplan"

   # Auth
   AUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database

   ```bash
   yarn migrate
   ```

5. Start the development server

   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
unplan/
├── prisma/           # Database schema and migrations
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # UI components
│   ├── config/       # Configuration files
│   ├── lib/          # Utility libraries
│   ├── utils/        # Helper functions
│   └── types/        # TypeScript type definitions
├── .env              # Environment variables
└── .gitignore        # Git ignore file
```

## Development Workflow

- **Feature Branches**: Create a new branch for each feature or fix
- **Pull Requests**: Submit PRs for code review before merging
- **Testing**: Write tests for new features
- **Documentation**: Update docs for API changes

## Deployment

UNPLAN can be deployed to any platform that supports Next.js applications:

- **Vercel**: Recommended for seamless deployment experience
- **AWS/GCP**: For more custom infrastructure needs
- **Docker**: Containerized deployment for consistency across environments

## License

PROPRIETARY AND CONFIDENTIAL

© UNPLAN 2025. All Rights Reserved.

This software and its documentation are proprietary and confidential to UNPLAN.
Unauthorized copying, distribution, modification, public display, or public performance
of this software and its documentation, in whole or in part, is strictly prohibited
without prior written consent from UNPLAN.

---
