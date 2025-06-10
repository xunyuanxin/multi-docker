import { render, screen } from '@testing-library/react';

jest.mock('./Fib', () => () => <div>Mocked Fib</div>);
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  expect(screen.getByText(/learn react/i)).toBeInTheDocument();
});