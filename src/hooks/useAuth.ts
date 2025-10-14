import { useEffect, useState } from 'react';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const loadUser = () => {
      const savedUser = localStorage.getItem('mermaid_ai_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('mermaid_ai_user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleGoogleLogin = async (googleUser: any) => {
    try {
      const { email, name, picture, sub: google_id } = googleUser;

      console.log('Google user info:', { email, name, google_id });

      // 检查用户是否已存在 - 不使用 .single()
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', google_id);

      if (fetchError) {
        console.error('Fetch user error:', fetchError);
        throw fetchError;
      }

      let userData: User;

      if (existingUsers && existingUsers.length > 0) {
        // 用户已存在,更新信息
        const existingUser = existingUsers[0];
        console.log('User exists, updating:', existingUser.id);

        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            email,
            name,
            picture,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('Update user error:', updateError);
          throw updateError;
        }
        userData = updatedUser;
        console.log('User updated:', userData);
      } else {
        // 创建新用户
        console.log('Creating new user');
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            google_id,
            email,
            name,
            picture,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Insert user error:', insertError);
          throw insertError;
        }
        userData = newUser;
        console.log('User created:', userData);
      }

      // 保存用户信息到 localStorage 和状态
      localStorage.setItem('mermaid_ai_user', JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('mermaid_ai_user');
    setUser(null);
  };

  return {
    user,
    loading,
    handleGoogleLogin,
    signOut,
  };
}
