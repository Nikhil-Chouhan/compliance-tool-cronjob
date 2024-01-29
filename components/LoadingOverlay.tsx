interface LoadingOverlayProps {
  isLoading: boolean;
}

export default function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    isLoading && (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    )
  );
}
