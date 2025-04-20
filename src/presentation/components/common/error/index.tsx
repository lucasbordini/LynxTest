import './styles.css';

type Props = {
  message: string;
};

export function ErrorBanner({ message }: Props) {
  if (!message) {
    return null;
  }

  return (
    <view className="error-banner">
      <text className="error-banner-text">{message}</text>
    </view>
  );
}
