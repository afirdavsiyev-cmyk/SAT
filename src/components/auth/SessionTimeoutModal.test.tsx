import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SessionTimeoutModal } from './SessionTimeoutModal';

describe('SessionTimeoutModal Component', () => {
  it('does not render dialog when isOpen is false and isExpired is false', () => {
    const { container } = render(
      <SessionTimeoutModal
        isOpen={false}
        remainingSeconds={60}
        onExtend={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders warning modal with formatted countdown when isOpen is true', () => {
    render(
      <SessionTimeoutModal
        isOpen={true}
        remainingSeconds={115} // 1 minute 55 seconds -> 01:55
        onExtend={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText(/Session Expiring Soon/i)).toBeDefined();
    expect(screen.getByText('01:55')).toBeDefined();
    expect(screen.getByRole('button', { name: /Stay Signed In/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeDefined();
  });

  it('calls onExtend when "Stay Signed In" button is clicked', () => {
    const handleExtend = vi.fn();
    render(
      <SessionTimeoutModal
        isOpen={true}
        remainingSeconds={45}
        onExtend={handleExtend}
        onLogout={vi.fn()}
      />
    );

    const extendBtn = screen.getByRole('button', { name: /Stay Signed In/i });
    fireEvent.click(extendBtn);

    expect(handleExtend).toHaveBeenCalledTimes(1);
  });

  it('calls onLogout when "Sign Out" button is clicked', () => {
    const handleLogout = vi.fn();
    render(
      <SessionTimeoutModal
        isOpen={true}
        remainingSeconds={45}
        onExtend={vi.fn()}
        onLogout={handleLogout}
      />
    );

    const logoutBtn = screen.getByRole('button', { name: /Sign Out/i });
    fireEvent.click(logoutBtn);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('renders expiration state when isExpired is true', () => {
    const handleCloseExpired = vi.fn();
    render(
      <SessionTimeoutModal
        isOpen={false}
        isExpired={true}
        remainingSeconds={0}
        onExtend={vi.fn()}
        onLogout={vi.fn()}
        onCloseExpired={handleCloseExpired}
      />
    );

    expect(screen.getByText(/Session Expired/i)).toBeDefined();
    expect(screen.getByText(/Your session has ended due to inactivity/i)).toBeDefined();
    const signInAgainBtn = screen.getByRole('button', { name: /Sign In Again/i });
    expect(signInAgainBtn).toBeDefined();

    fireEvent.click(signInAgainBtn);
    expect(handleCloseExpired).toHaveBeenCalledTimes(1);
  });
});
