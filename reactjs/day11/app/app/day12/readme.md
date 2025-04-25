# React Fundamentals

This guide covers essential React concepts and hooks for building interactive web applications.

## 1. useState Hook

The useState hook is used for managing state in functional components.

```jsx
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: "", age: 0 });

// Example usage
const handleIncrement = () => {
  setCount((prevCount) => prevCount + 1);
};
```

## 2. Event Handling in React

React events are named using camelCase and passed as JSX attributes.

```jsx
const handleClick = (e) => {
  e.preventDefault();
  console.log("Button clicked");
};

<button onClick={handleClick}>Click me</button>;
```

## 3. Conditional Rendering

There are multiple ways to conditionally render content in React:

```jsx
// Using ternary operator
{
  isLoggedIn ? <UserDashboard /> : <LoginForm />;
}

// Using && operator
{
  showMessage && <Message />;
}

// Using if statements in functions
const renderContent = () => {
  if (isLoading) return <Loader />;
  if (error) return <Error />;
  return <Content />;
};
```

## 4. Rendering Lists

When rendering lists in React, each item needs a unique 'key' prop:

```jsx
const items = ["Apple", "Banana", "Orange"];

{
  items.map((item, index) => <li key={index}>{item}</li>);
}
```

## 5. Form Handling

Managing form inputs and their changes:

```jsx
const [formData, setFormData] = useState({
  username: "",
  email: "",
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

// Usage in JSX
<input
  type="text"
  name="username"
  value={formData.username}
  onChange={handleChange}
/>;
```

## Best Practices

1. Always use keys when rendering lists
2. Keep state updates immutable
3. Handle form submissions properly
4. Use appropriate event handlers
5. Implement error boundaries for error handling

## Common Patterns

1. Controlled Components
2. Lifting State Up
3. Composition vs Inheritance
4. Conditional Rendering Patterns
5. Event Handler Naming Conventions

## Additional Tips

- Use functional updates with useState when new state depends on previous state
- Implement proper form validation
- Handle edge cases in conditional rendering
- Optimize list rendering for better performance
- Follow React naming conventions for components and handlers
