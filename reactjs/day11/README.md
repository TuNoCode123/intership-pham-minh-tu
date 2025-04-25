# ReactJS Overview

## Introduction

ReactJS is a JavaScript library developed by Facebook (Meta) for building modern user interfaces. It has become one of the most popular front-end libraries due to its efficiency and flexibility.

## Key Features

### 1. Virtual DOM

- Maintains a lightweight copy of the actual DOM
- Efficiently updates only what needs to be changed
- Results in better performance

### 2. Component-Based Architecture

- Breaks UI into reusable, independent pieces
- Promotes code reusability
- Makes maintenance easier
- Supports both functional and class components

### 3. Single-Page Applications (SPAs)

- Perfect for building dynamic web applications
- Smooth user experience with no page reloads
- Client-side routing capabilities

### 4. Unidirectional Data Flow

- Data flows in one direction from parent to child
- Makes application behavior more predictable
- Easier debugging and maintenance

## Getting Started

```bash
# Create a new React project
npx create-react-app my-app

# Navigate to project directory
cd my-app

# Start development server
npm start
```

// ...existing code...

## JSX Syntax

### Basic Rules

- Must return a single root element
- Close all tags
- Use camelCase for attributes
- Use curly braces for JavaScript expressions

```jsx
function Greeting() {
  const name = "John";
  return (
    <div className="greeting">
      <h1>Hello {name}!</h1>
      <img src="avatar.png" alt="profile" />
    </div>
  );
}
```

## Functional Components

### Basic Structure

```jsx
// Simple Component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Arrow Function Component
const Welcome = ({ name }) => {
  return <h1>Hello, {name}</h1>;
};
```

### Hooks Example

```jsx
import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

## Props & Children

### Props Usage

```jsx
// Parent Component
function App() {
  return <UserCard name="John" age={25} />;
}

// Child Component
function UserCard({ name, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}
```

### Children Props

```jsx
// Container Component
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage
function App() {
  return (
    <Card title="Welcome">
      <p>This is the content</p>
      <button>Click me</button>
    </Card>
  );
}
```

## Project Setup

### Create New Project

```bash
# Using npm
npx create-react-app my-app

# Using Vite
npm create vite@latest my-app -- --template react
```

### Project Structure

```
my-app/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js/react.config.js
```

## Code Style Convention

### File & Component Naming

- Components: PascalCase (UserProfile.jsx)
- Utilities: camelCase (formatDate.js)
- One component per file
- Match file name with component name

### Component Structure

```jsx
// Import statements
import { useState } from "react";
import PropTypes from "prop-types";

// Component definition
function UserProfile({ name, age }) {
  // Hooks
  const [isEditing, setIsEditing] = useState(false);

  // Event handlers
  const handleClick = () => {
    setIsEditing(!isEditing);
  };

  // Render
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

// PropTypes
UserProfile.propTypes = {
  name: PropTypes.string.required,
  age: PropTypes.number.required,
};

// Export
export default UserProfile;
```

### Best Practices

- Use functional components over class components
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful variable and function names
- Add PropTypes for type checking
- Use destructuring for props
- Comment complex logic
