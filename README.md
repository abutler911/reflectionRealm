# ReflectionRealm

A personal blog for publishing thoughts and reflections without interaction or feedback.

## Features

- Simple markdown-based content management
- MongoDB for data storage
- Responsive design with light/dark mode
- No comments or contact functionality by design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your MongoDB connection string:
4. Start the development server: `npm run dev`

### Adding Content

1. Create a markdown file in the `content/posts` directory
2. Add frontmatter with title, date, tags, etc.
3. Write your content in markdown
4. Import to the database: `npm run import`

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm run import` - Import markdown posts to the database
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix code quality issues automatically