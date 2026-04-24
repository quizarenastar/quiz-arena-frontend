# Quiz Arena Frontend

A React-based frontend for the Quiz Arena application.

## Features

- User authentication
- Quiz creation and participation
- Real-time leaderboard
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/quiz-arena-frontend.git
cd quiz-arena-frontend
npm install
```

### Configuration

1. Copy the environment variables file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your actual values:

- Set `VITE_API_URL` to your backend API URL
- Set `VITE_SOCKET_URL` for real-time features
- Add your Google OAuth client ID for authentication

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

## Contributing

Contributions are welcome! Please open issues or submit pull requests.
