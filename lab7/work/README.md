# User Routes Lab 7

A React Native Web frontend connected to an Express API. The project demonstrates two separate user-data routes: one for even IDs and one for odd IDs.

## Technology

- Node.js and Express
- React Native with Expo
- React Native Web
- JavaScript ES modules

## Run the backend

```bash
cd backend
npm install
npm start
```

The API runs at `http://localhost:3000`.

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run web
```

Expo prints the browser URL in the terminal.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Checks that the API is running |
| GET | `/api/users/even` | Returns users with even IDs |
| GET | `/api/users/odd` | Returns users with odd IDs |

## Frontend work demonstrated

- React Native components using `View`, `Text`, `Pressable`, `FlatList`, and `SafeAreaView`
- Reusable components with props
- State and event handling
- Conditional rendering
- Loading and error states
- Fetching data from an Express API
- Responsive React Native Web styling
- Segmented selection between even and odd user collections

## Assignment verification

The API returns IDs `2,4,6` from the even route and IDs `1,3,5` from the odd route. The frontend displays each collection through the corresponding segmented control.
