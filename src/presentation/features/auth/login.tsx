import { useState } from '@lynx-js/react';
import { useNavigate } from 'react-router';
import './login.css';
import logoReadyRemit from '../../../assets/logo_ready_remit.png';
import SafeViewArea from '../../components/common/safearea/index.jsx';
import { Input } from '../../components/common/input/index.jsx';
import { authService } from '../../../data/services/auth-service.js';
import { authManager } from '../../../domain/managers/auth-manager.js';
import { PrimaryButton } from '../../components/common/primary-button/index.jsx';
import { ErrorBanner } from '../../components/common/error/index.jsx';

export function Login() {
  const [senderId, setSenderId] = useState(
    '800e4e04-adb7-40a6-a017-d021d5f4a539',
  );
  const [clientId, setClientId] = useState('ARMH0XcPdIu59gbE7lwZgzNCOz55LOp9');
  const [clientSecret, setClientSecret] = useState(
    '4_wsIMWqWwS2Q_1ztprOvsUexQRov8WbZJ5D4STnOsDi14tM94YyjLA9-xLwc5t1',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      const request = {
        client_id: clientId,
        client_secret: clientSecret,
        audience: 'https://dev-api.readyremit.com',
        grant_type: 'client_credentials',
        sender_id: senderId,
      };
      const response = await authService.login(request);
      authManager.saveToken(response);
      console.log('Login successful');
      navigate('/transfer');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeViewArea>
      <view className="login-bg">
        <view className="login-content">
          <text className="login-title">Welcome to Ready Remit</text>
          <text className="login-subtitle">Login to continue</text>
          <view className="input-section">
            <image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR218KoJ_NEGUC-i6rRfYhCnpUNXjrmpiUUNg&s"
              className="login-header-image"
              mode="aspectFit"
            />
            <view className="input-group">
              <text className="label">Sender ID</text>
              <Input
                initialValue={senderId}
                placeholder="Sender ID"
                onValueChange={setSenderId}
                className="input-field"
              />
            </view>
            <view className="input-group">
              <text className="label">Client ID</text>
              <Input
                initialValue={clientId}
                placeholder="Client ID"
                onValueChange={setClientId}
                className="input-field"
              />
            </view>
            <view className="input-group">
              <text className="label">Client Secret</text>
              <Input
                initialValue={clientSecret}
                placeholder="Client Secret"
                onValueChange={setClientSecret}
                className="input-field"
              />
            </view>
          </view>
          <PrimaryButton
            label="Start Ready Remit SDK"
            onClick={handleSubmit}
            isLoading={loading}
            className="login-button"
          />
          <ErrorBanner message={error} />
          <text className="dev-label">(Dev Only)</text>
        </view>
      </view>
    </SafeViewArea>
  );
}
