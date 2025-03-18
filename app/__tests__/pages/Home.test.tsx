import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useInView } from 'react-intersection-observer';
import HomePage from '../../page';

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Convert boolean props to strings
    const imgProps = {
      ...props,
      fill: props.fill ? "true" : undefined,
      priority: props.priority ? "true" : undefined
    };
    return <img {...imgProps} />
  },
}));

// Mock window.open and scrollTo for navigation tests
const mockOpen = jest.fn();
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true
});
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});
Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true
});

describe('Home Page', () => {
  beforeEach(() => {
    (useInView as jest.Mock).mockReturnValue({ ref: jest.fn(), inView: true });
    jest.clearAllMocks();
  });

  it('scrolls to upcoming events section when chevron is clicked', () => {
    const mockGetBoundingClientRect = jest.fn().mockReturnValue({ top: 500 });
    const mockQuerySelector = jest.fn().mockReturnValue({
      getBoundingClientRect: mockGetBoundingClientRect
    });
    document.querySelector = mockQuerySelector;

    render(<HomePage />);
    const chevronDown = screen.getByTestId('chevron-down');
    fireEvent.click(chevronDown);

    expect(mockQuerySelector).toHaveBeenCalledWith('#upcoming-events');
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 400,
      behavior: 'smooth'
    });
  });

  it('renders the hero section with team name', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Sapienza Foiling Team');
  });

  it('renders upcoming events section with event details', () => {
    render(<HomePage />);
    expect(screen.getByText('Prossimi Eventi')).toBeInTheDocument();
    expect(screen.getByText('2025 SuMoth Challenge')).toBeInTheDocument();
    expect(screen.getByText('16 Giugno 2025')).toBeInTheDocument();
    expect(screen.getByText('Garda, Verona')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<HomePage />);
    expect(screen.getByLabelText('Instagram')).toHaveAttribute('href', 'https://www.instagram.com/sapienzafoilingteam/');
    expect(screen.getByLabelText('LinkedIn')).toHaveAttribute('href', 'https://www.linkedin.com/company/sapienza-foiling-team/about/');
    expect(screen.getByLabelText('Facebook')).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61572515878295');
  });

  it('renders call-to-action section', () => {
    render(<HomePage />);
    expect(screen.getByText('Entra a far parte del team')).toBeInTheDocument();
    expect(screen.getByText('Unisciti a noi')).toBeInTheDocument();
  });

  it('handles call-to-action button click', () => {
    render(<HomePage />);
    const joinButton = screen.getByText('Unisciti a noi');
    fireEvent.click(joinButton);
    expect(mockOpen).toHaveBeenCalledWith('https://docs.google.com/forms/d/1TsTV28v7nggIEp98K8JGwtKbrV5P-9xzHIxmuFlSXCs/edit?pli=1', '_blank');
  });

  it('handles event card click', () => {
    render(<HomePage />);
    const eventCard = screen.getByText('2025 SuMoth Challenge').closest('div');
    if (eventCard) fireEvent.click(eventCard);
    expect(mockOpen).toHaveBeenCalledWith('https://sumoth.org', '_blank');
  });
});