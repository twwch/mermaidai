import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface GoogleJWT {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export function Auth() {
  const { handleGoogleLogin } = useAuth();

  const onSuccess = async (credentialResponse: any) => {
    try {
      const decoded = jwtDecode<GoogleJWT>(credentialResponse.credential);
      await handleGoogleLogin(decoded);
    } catch (error) {
      console.error('Login failed:', error);
      alert('登录失败,请重试');
    }
  };

  const onError = () => {
    console.error('Google Login Failed');
    alert('Google 登录失败,请重试');
  };

  if (!googleClientId || googleClientId === 'your_google_client_id') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              配置错误
            </h1>
            <p className="text-gray-600 mb-4">
              请先配置 Google Client ID
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-700 mb-2">
                1. 复制 .env.example 为 .env
              </p>
              <p className="text-sm text-gray-700 mb-2">
                2. 在 .env 中设置 VITE_GOOGLE_CLIENT_ID
              </p>
              <p className="text-sm text-gray-700">
                3. 重启开发服务器
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
              AI 驱动的流程图生成工具
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
              ux_mode="popup"
            />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>登录即表示您同意我们的服务条款和隐私政策</p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
