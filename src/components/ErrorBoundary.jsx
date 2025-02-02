import React from 'react';
import { styled } from '@mui/material';

const ErrorContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: '8px',
    textAlign: 'center'
});

const ErrorMessage = styled('p')({
    marginBottom: '1rem',
    fontSize: '1.1rem'
});

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorContainer>
                    <ErrorMessage>
                        {this.props.fallback || 'Something went wrong. Please try refreshing the page.'}
                    </ErrorMessage>
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
