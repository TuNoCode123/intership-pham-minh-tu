# Day 13 - API Integration Exercise

A React application demonstrating API integration with TypeScript and responsive design.

## Overview

This exercise focuses on fetching and displaying user data from an external API using React and TypeScript, with responsive styling using Tailwind CSS.

## Features

### 1. API Integration

- Fetches user data from JSONPlaceholder API
- Uses TypeScript for type safety
- Implements error handling for API requests

### 2. User Interface

- Displays user cards in a responsive grid layout
- Shows user details including:
  - Name
  - Phone number
  - Email address
- Responsive design using Tailwind CSS grid system

### 3. Component Structure

```typescript
const AppDay13 = () => {
  const [users, setUsers] = useState<any>([]);

  const getListuser = async () => {
    const url = "https://jsonplaceholder.typicode.com/users";
    // API integration logic
  };

  useEffect(() => {
    getListuser();
  }, []);

  return (
    // Component JSX
  );
};
```

## Implementation Details

### API Integration

```typescript
const getListuser = async () => {
  const url = "https://jsonplaceholder.typicode.com/users";
  const body = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(url, body);
  if (res.ok) {
    const data = await res.json();
    setUsers(data);
  }
};
```

### Responsive Layout

```tsx
<div className="container p-5 text-3xl grid grid-cols-3 gap-4">
  {users.length > 0 &&
    users?.map((u: any, index: number) => {
      return (
        <div key={index} className="mt-3 border-2 rounded-2xl p-3">
          <div>{u?.name}</div>
          <div>{u?.phone}</div>
          <div>{u?.email}</div>
        </div>
      );
    })}
</div>
```

## Key Concepts Covered

1. **API Integration**

   - Fetch API usage
   - Async/await implementation
   - Error handling

2. **React Hooks**

   - useState for state management
   - useEffect for data fetching

3. **TypeScript**

   - Type definitions
   - Generic types
   - Type safety

4. **Responsive Design**
   - Grid layout
   - Tailwind CSS utilities
   - Mobile-first approach

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Access the application:

```
http://localhost:5173/day13
```

## API Reference

The application uses the JSONPlaceholder API:

- Endpoint: `https://jsonplaceholder.typicode.com/users`
- Method: GET
- Response: Array of user objects

## Best Practices Implemented

1. **Error Handling**

   - API error checks
   - Loading states
   - Error messages

2. **Performance**

   - Conditional rendering
   - Proper state management

3. **Code Organization**
   - Clean component structure
   - Separated concerns
   - Type safety with TypeScript

## Future Improvements

1. Add loading states
2. Implement better error handling
3. Add user interface for adding/editing users
4. Implement proper TypeScript interfaces for user data
5. Add pagination or infinite scroll
