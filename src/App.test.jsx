import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
    });

    it('displays the correct text', () => {
        const { getByText } = render(<App />);
        expect(getByText('Expected Text')).toBeInTheDocument();
    });
});