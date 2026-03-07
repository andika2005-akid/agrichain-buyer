import React from "react";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Could send to logging service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Terjadi kesalahan pada aplikasi</h2>
            <p className="text-sm text-muted-foreground mt-2">{this.state.error?.message || "Error tidak diketahui"}</p>
          </div>
        </div>
      );
    }
    return this.props.children as JSX.Element;
  }
}
