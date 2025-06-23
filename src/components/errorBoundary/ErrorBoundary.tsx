import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });

        console.error('[ErrorBoundary] Render failure:', error);
        console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

        if (error.message.includes('hydration') || error.message.includes('Hydration')) {
            setTimeout(() => {
                this.setState({ hasError: false });
            }, 100);
        }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="error-recovery-container p-6 bg-white rounded-lg shadow-lg mx-auto my-8 max-w-lg text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-3">Aplikasi mengalami error teknis</h2>
                    <p className="text-black-700 mb-4">Silahkan coba refresh halaman</p>
                    <button
                        onClick={() => {
                            try {
                                sessionStorage.clear();
                                localStorage.clear();
                                window.location.reload();
                            } catch (e) {
                                this.setState({ hasError: false });
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Refresh Aplikasi
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;