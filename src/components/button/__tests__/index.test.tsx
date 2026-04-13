import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', {name: 'Click me'})).toBeInTheDocument();
  });

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has type="button" by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('passes through arbitrary HTML attributes', () => {
    render(<Button data-testid="my-btn">Click</Button>);
    expect(screen.getByTestId('my-btn')).toBeInTheDocument();
  });
});
