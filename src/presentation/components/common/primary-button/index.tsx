import './styles.css';

interface PrimaryButtonProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  className: string;
}

export function PrimaryButton({
  label,
  onClick,
  isLoading = false,
  className,
}: PrimaryButtonProps) {
  const handleClick = () => {
    if (!isLoading) {
      onClick();
    }
  };

  return (
    <view
      className={`primary-button-container ${isLoading ? 'loading' : ''} ${className}`}
      bindtap={handleClick}
    >
      {isLoading ? (
        <view className="primary-button-spinner"></view>
      ) : (
        <text className="primary-button-label">{label}</text>
      )}
    </view>
  );
}
