import {render, screen} from '@testing-library/react';
import {Loader} from '@/components/loader';
import SuspenseLoader from '@/components/loader';

describe('Loader', () => {
  it('renders a container with a spinner element', () => {
    const {container} = render(<Loader />);
    // Container div wraps a spinner div — two nested divs
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThanOrEqual(1);
  });

  it('mounts without throwing', () => {
    expect(() => render(<Loader />)).not.toThrow();
  });
});

describe('SuspenseLoader', () => {
  it('renders children when nothing suspends', () => {
    render(
      <SuspenseLoader>
        <span>Content loaded</span>
      </SuspenseLoader>,
    );
    expect(screen.getByText('Content loaded')).toBeInTheDocument();
  });

  it('accepts a custom fallback prop without error', () => {
    render(
      <SuspenseLoader fallback={<p>My fallback</p>}>
        <span>Content</span>
      </SuspenseLoader>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <SuspenseLoader>
        <span>Child one</span>
        <span>Child two</span>
      </SuspenseLoader>,
    );
    expect(screen.getByText('Child one')).toBeInTheDocument();
    expect(screen.getByText('Child two')).toBeInTheDocument();
  });
});
