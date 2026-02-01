# Stock Data Distribution Backend API

A backend API for a stock data distribution system built with Convex + Next.js.

## Features

- **User Authentication**: Login with email/password
- **Stock Management**: Upload and retrieve stock data with OHLCV (Open, High, Low, Close, Volume)
- **User Management**: Create and list user accounts
- **Shareable Links**: Generate and manage shareable registration links with expiry dates
- **User Expiry**: Check and deactivate expired users
- **Download Tracking**: Optional logging of download activities (MVP)

## Tech Stack

- Next.js (App Router)
- Convex (database + backend functions)
- TypeScript
- Electron (desktop app integration)

## Setup Instructions

### 1. Install Dependencies

The project already has Convex installed. If not, run:

```bash
npm install convex
```

### 2. Initialize Convex

If this is a new Convex project, initialize it:

```bash
npx convex dev
```

This command will:
- Create a new Convex deployment
- Generate type definitions from your schema
- Start a development server

### 3. Configure CORS for Electron App

If you're using this API with an Electron app, you need to configure allowed origins:

1. Go to your [Convex Dashboard](https://dashboard.convex.dev/)
2. Select your project (tradeline)
3. Go to **Settings** > **Allowed Origins**
4. Add your Electron app's origin:
   - For development: `file://` (to allow local file access)
   - For production: Add your app's specific protocol (e.g., `tradeline://`)
   - You can also add `*` to allow all origins (not recommended for production)

5. Save the changes

**Note**: Convex allows all origins by default in development mode.

### 3. Push Schema to Convex

The schema has been defined in `convex/schema.ts`. The Convex CLI will automatically detect schema changes and regenerate types when you run `npx convex dev`.

### 4. Regenerate Types

After creating or modifying the schema, regenerate the Convex types:

```bash
npx convex dev
```

This will update the files in `convex/_generated/` with the latest type definitions.

### 5. Run Development Server

Start the Next.js development server:

```bash
npm run dev
```

The API functions are now available at `api.<module>.<function>`.

## API Functions

### Authentication (`api.auth`)

#### `login` (mutation)
Authenticate a user with email and password.

```typescript
import { useMutation } from "convex/react";

const login = useMutation(api.auth.login);

const result = await login({
  email: "user@example.com",
  password: "password123"
});

// Returns: { success: boolean, user: { id, email, name } | null }
```

### Stock Management (`api.stocks`)

#### `uploadStocks` (mutation)
Upload a new batch of stock data.

```typescript
import { useMutation } from "convex/react";

const uploadStocks = useMutation(api.stocks.uploadStocks);

const result = await uploadStocks({
  stocks: [
    {
      symbol: "ABBEYBDS",
      date: "12/29/25",
      open: 5.85,
      high: 5.85,
      low: 5.85,
      close: 5.85,
      volume: 192953
    }
  ]
});

// Returns: { success: boolean, updateId: string, stocksCount: number }
```

#### `getLatest` (query)
Get the most recent stock update with all data.

```typescript
import { useQuery } from "convex/react";

const latestUpdate = useQuery(api.stocks.getLatest);

// Returns: Latest stock update object or null
```

#### `getHistory` (query)
Get all stock updates (metadata only).

```typescript
import { useQuery } from "convex/react";

const history = useQuery(api.stocks.getHistory);

// Returns: Array of { id, publishDate, stocksCount, createdAt }
```

### User Management (`api.users`)

#### `createUser` (mutation)
Create a new user account.

```typescript
import { useMutation } from "convex/react";

const createUser = useMutation(api.users.createUser);

const result = await createUser({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});

// Returns: { success: boolean, userId: string | null }
```

#### `listUsers` (query)
List all users (without passwords).

```typescript
import { useQuery } from "convex/react";

const users = useQuery(api.users.listUsers);

// Returns: Array of { id, name, email, isActive, lastLogin, createdAt }
```

### Shareable Links (`api.shareableLinks`)

#### `generateShareableLink` (mutation)
Generate a new shareable registration link with start and expiry dates.

```typescript
import { useMutation } from "convex/react";

const generateLink = useMutation(api.shareableLinks.generateShareableLink);

const startDate = Date.now() + 86400000; // Tomorrow
const expiryDate = Date.now() + 604800000; // 7 days from now

const result = await generateLink({
  startDate,
  expiryDate
});

// Returns: { success: boolean, token: string | null, error?: string }
```

#### `validateShareableLink` (query)
Validate a shareable link token.

```typescript
import { useQuery } from "convex/react";

const validation = useQuery(api.shareableLinks.validateShareableLink, {
  token: "your-token-here"
});

// Returns: { valid: boolean, error?: string, startDate?: number, expiryDate?: number }
```

#### `registerFromShareableLink` (mutation)
Register a new user using a valid shareable link.

```typescript
import { useMutation } from "convex/react";

const register = useMutation(api.shareableLinks.registerFromShareableLink);

const result = await register({
  token: "your-token-here",
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});

// Returns: { success: boolean, userId: string | null, error?: string }
```

#### `listShareableLinks` (query)
List all shareable links with their status.

```typescript
import { useQuery } from "convex/react";

const links = useQuery(api.shareableLinks.listShareableLinks);

// Returns: Array of { id, token, startDate, expiryDate, isUsed, userId, createdAt, isExpired, isNotYetActive }
```

### User Expiry (`api.userExpiry`)

#### `checkUserExpiry` (query)
Check if a user's access has expired.

```typescript
import { useQuery } from "convex/react";

const expiryStatus = useQuery(api.userExpiry.checkUserExpiry, {
  userId: "user-id-here"
});

// Returns: { isExpired: boolean, expiryDate: number | null }
```

#### `deactivateExpiredUsers` (mutation)
Deactivate all users whose expiry date has passed.

```typescript
import { useMutation } from "convex/react";

const deactivate = useMutation(api.userExpiry.deactivateExpiredUsers);

const result = await deactivate();

// Returns: { success: boolean, deactivatedCount: number }
```

## Database Schema

### Users Table
- `id`: Auto-generated
- `name`: string
- `email`: string (unique)
- `passwordHash`: string (plain text for MVP)
- `isActive`: boolean
- `lastLogin`: timestamp (ms since epoch)
- `createdAt`: timestamp (ms since epoch)
- `startDate`: optional timestamp (ms since epoch) - User access start date
- `expiryDate`: optional timestamp (ms since epoch) - User access expiry date

### Stock Updates Table
- `id`: Auto-generated
- `publishDate`: ISO string
- `stocks`: array of stock objects
- `stocksCount`: number
- `createdAt`: timestamp (ms since epoch)

### Shareable Links Table
- `id`: Auto-generated
- `token`: string (unique) - Shareable link token
- `startDate`: timestamp (ms since epoch) - Link activation start date
- `expiryDate`: timestamp (ms since epoch) - Link expiry date
- `isUsed`: boolean - Whether link has been used
- `userId`: optional reference to Users - User created from this link
- `createdAt`: timestamp (ms since epoch)

### Download Logs Table (Optional)
- `id`: Auto-generated
- `userId`: reference to Users
- `updateId`: reference to Stock Updates
- `downloadedAt`: timestamp (ms since epoch)
- `success`: boolean

## Stock Data Format

```json
{
  "symbol": "ABBEYBDS",
  "date": "12/29/25",
  "open": 5.85,
  "high": 5.85,
  "low": 5.85,
  "close": 5.85,
  "volume": 192953
}
```

## Important Notes

### Password Security
For MVP purposes, passwords are stored as plain text. In production, you should:
1. Install bcrypt: `npm install bcrypt @types/bcrypt`
2. Update `createUser` to hash passwords
3. Update `login` to compare hashed passwords

### Email Uniqueness
The schema includes an index on `email` for fast lookups, but uniqueness should be enforced at the application level (currently done in `createUser`).

### Error Handling
All functions include try-catch blocks and return appropriate error responses. Check the `success` field in mutation responses.

## Development Workflow

1. Make changes to functions in `convex/` directory
2. Run `npx convex dev` to push changes and regenerate types
3. Test your functions in the Next.js application

## Useful Commands

```bash
# Start Convex development server
npx convex dev

# View Convex dashboard
npx convex dashboard

# Deploy to production
npx convex deploy

# Check Convex logs
npx convex logs
```

## Troubleshooting

### Type Errors
If you see TypeScript errors related to Convex types, run:
```bash
npx convex dev
```

### Schema Changes
After modifying `convex/schema.ts`, you must run:
```bash
npx convex dev
```
This will regenerate the type definitions.

### Connection Issues
Ensure your Convex deployment URL is correctly configured in `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=your-convex-url
```

## License

MIT
