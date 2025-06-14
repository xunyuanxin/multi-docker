import { render, screen } from '@testing-library/react';

jest.mock('./Fib', () => () => <div>Mocked Fib</div>);
import App from './App';

test('renders hi there link', () => {
  render(<App />);
  expect(screen.getByText(/Fib Calculator/i)).toBeInTheDocument();
});