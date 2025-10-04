# Smart Study Platform

A comprehensive platform for sharing and accessing study materials with secure delivery options.

## Features

- User authentication and authorization (Student, Teacher, Admin)
- Upload and manage study materials
- Secure file delivery system
- Search and filter materials by subject and grade level
- User dashboard with download history
- Admin dashboard for content management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, xss-clean, hpp, express-rate-limit
- **File Uploads**: Multer
- **Logging**: Morgan
- **Environment Management**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm (v6 or higher) or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-study-platform.git
   cd smart-study-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. **Set up the database**
   ```bash
   # Create the database
   npm run db:create
   
   # Run migrations
   npm run db:migrate
   
   # Seed initial data (optional)
   npm run db:seed
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_NAME=smart_study_platform
DB_USER=root
DB_PASSWORD=
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# File Uploads
MAX_FILE_UPLOAD=10000000 # 10MB
FILE_UPLOAD_PATH=./public/uploads
```

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

### Production Mode
```bash
npm start
# or
yarn start
```

The API will be available at `http://localhost:5000`

## API Documentation

API documentation is available at `/api/v1/docs` when the server is running.

## Database Schema

![Database Schema](public/images/database-schema.png)

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm run db:create` - Create the database
- `npm run db:drop` - Drop the database
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:undo` - Undo the last database migration
- `npm run db:seed` - Seed the database with initial data
- `npm run db:reset` - Reset the database (drop, create, migrate, seed)

## Project Structure

```
smart-study-platform/
├── config/               # Configuration files
│   ├── config.js         # Database configuration
│   └── db.js             # Database connection
├── controllers/          # Route controllers
├── middleware/           # Custom middleware
├── migrations/           # Database migrations
├── models/               # Database models
├── public/               # Static files
│   └── uploads/          # File uploads
├── routes/               # API routes
├── seeders/              # Database seeders
├── utils/                # Utility functions
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
└── server.js             # Application entry point
```

## Security

- **Authentication**: JWT-based authentication
- **Password Hashing**: bcryptjs
- **Security Headers**: Helmet
- **Input Sanitization**: xss-clean, hpp
- **Rate Limiting**: express-rate-limit
- **CORS**: Configured with allowed origins

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the GitHub repository or contact [your-email@example.com](mailto:pritwish2006nht@gmail.com).

