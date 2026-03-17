import {render, fireEvent, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Link from '@/components/link';

interface RenderOptions {
  to?: string;
  currentPath?: string;
  onClick?: jest.Mock;
  className?: string;
  activeClassName?: string;
}

const renderLink = ({
  to = '/other',
  currentPath = '/current',
  onClick = jest.fn(),
  className,
  activeClassName,
}: RenderOptions = {}): {anchor: HTMLElement; onClick: jest.Mock} => {
  render(
    <MemoryRouter initialEntries={[currentPath]}>
      <Link to={to} onClick={onClick} className={className} activeClassName={activeClassName}>
        Click
      </Link>
    </MemoryRouter>,
  );
  return {anchor: screen.getByRole('link'), onClick};
};

describe('Link — same-location navigation prevention', () => {
  it('does not call onClick when clicking a link to the current location', () => {
    const {anchor, onClick} = renderLink({to: '/current', currentPath: '/current'});
    fireEvent.click(anchor, {button: 0});
    expect(onClick).not.toHaveBeenCalled();
  });

  it('prevents the default browser action when clicking to the current location', () => {
    const {anchor} = renderLink({to: '/current', currentPath: '/current'});
    const prevented = !fireEvent.click(anchor, {button: 0});
    expect(prevented).toBe(true);
  });

  it('calls onClick when clicking to a different location', () => {
    const {anchor, onClick} = renderLink({to: '/other', currentPath: '/current'});
    fireEvent.click(anchor, {button: 0});
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Link — modifier key passthrough', () => {
  it('calls onClick and skips prevention logic when ctrlKey is held', () => {
    const {anchor, onClick} = renderLink({to: '/current', currentPath: '/current'});
    fireEvent.click(anchor, {button: 0, ctrlKey: true});
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when metaKey is held', () => {
    const {anchor, onClick} = renderLink({to: '/current', currentPath: '/current'});
    fireEvent.click(anchor, {button: 0, metaKey: true});
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when altKey is held', () => {
    const {anchor, onClick} = renderLink({to: '/current', currentPath: '/current'});
    fireEvent.click(anchor, {button: 0, altKey: true});
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when shiftKey is held', () => {
    const {anchor, onClick} = renderLink({to: '/current', currentPath: '/current'});
    fireEvent.click(anchor, {button: 0, shiftKey: true});
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when button !== 0 (non-primary click)', () => {
    const {anchor, onClick} = renderLink({to: '/current', currentPath: '/current'});
    fireEvent.click(anchor, {button: 1});
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Link — location comparison with query string and hash', () => {
  it('prevents navigation when to matches pathname + search', () => {
    const {anchor, onClick} = renderLink({
      to: '/current?q=1',
      currentPath: '/current?q=1',
    });
    fireEvent.click(anchor, {button: 0});
    expect(onClick).not.toHaveBeenCalled();
  });

  it('navigates when search differs from current', () => {
    const {anchor, onClick} = renderLink({
      to: '/current?q=2',
      currentPath: '/current?q=1',
    });
    fireEvent.click(anchor, {button: 0});
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Link — className', () => {
  it('applies the className prop to the anchor', () => {
    const {anchor} = renderLink({className: 'my-class'});
    expect(anchor.className).toContain('my-class');
  });

  it('applies activeClassName when the link is active', () => {
    renderLink({to: '/current', currentPath: '/current', activeClassName: 'active'});
    expect(screen.getByRole('link').className).toContain('active');
  });

  it('does not apply activeClassName when the link is not active', () => {
    renderLink({to: '/other', currentPath: '/current', activeClassName: 'active'});
    expect(screen.getByRole('link').className).not.toContain('active');
  });
});
