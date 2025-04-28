import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary-fallback">
          <h3>Something went wrong</h3>
          <p>We couldn't display this content.</p>
          {this.props.resetHandler && (
            <button onClick={this.props.resetHandler}>
              Try again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;