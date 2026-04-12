// backend/server.js - ADD THIS TO YOUR EXISTING SERVER.JS FILE

// Add this import near your other route imports
import chatRoute from './routes/chatRoute.js'

// Add this line with your other route definitions
// (Usually after your existing routes like productRoute, userRoute, etc.)
app.use('/api/chat', chatRoute)

// Make sure you have these middleware configured:
// - express.json() for parsing JSON
// - CORS middleware (if frontend is on different origin)
// - Authentication middleware (already used by chatRoute)
