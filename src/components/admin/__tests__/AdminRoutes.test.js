import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminRoutes from '../AdminRoutes';

// Mock Firebase auth
jest.mock('../../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null); // No user logged in
      return jest.fn(); // unsubscribe function
    })
  }
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AdminRoutes', () => {
  test('renders login page when no user is authenticated', () => {
    renderWithRouter(<AdminRoutes />);
    
    // Should redirect to login when no user
    expect(window.location.pathname).toBe('/admin/login');
  });
});
