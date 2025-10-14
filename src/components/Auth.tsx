import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface GoogleJWT {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export function Auth() {
  const { t } = useTranslation();
  const { handleGoogleLogin } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const onSuccess = async (credentialResponse: any) => {
    try {
      setIsLoggingIn(true);
      const decoded = jwtDecode<GoogleJWT>(credentialResponse.credential);
      await handleGoogleLogin(decoded);
      // 登录成功后，App 组件会自动重新渲染并显示主界面
    } catch (error) {
      console.error('Login failed:', error);
      alert(t('auth.loginError'));
      setIsLoggingIn(false);
    }
  };

  const onError = () => {
    console.error('Google Login Failed');
    alert(t('auth.googleLoginError'));
  };

  if (!googleClientId || googleClientId === 'your_google_client_id') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {t('auth.configError')}
            </h1>
            <p className="text-gray-600 mb-4">
              {t('auth.configErrorDesc')}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-700 mb-2">
                {t('auth.configStep1')}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                {t('auth.configStep2')}
              </p>
              <p className="text-sm text-gray-700">
                {t('auth.configStep3')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Mermaid AI
            </h1>
            <p className="text-gray-600">
              {t('auth.description')}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {isLoggingIn ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-600">{t('auth.loggingIn')}</p>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
                ux_mode="popup"
              />
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>{t('auth.terms')}</p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
