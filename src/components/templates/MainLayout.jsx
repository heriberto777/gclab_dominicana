import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import ChatBot from '../molecules/ChatBot';
import { supabase } from '../../lib/supabase';
import './MainLayout.css';

const MainLayout = () => {
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    const fetchWebhookUrl = async () => {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'n8n_webhook_url')
        .maybeSingle();

      if (data) {
        setWebhookUrl(data.value);
      }
    };

    fetchWebhookUrl();
  }, []);

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ChatBot webhookUrl={webhookUrl} />
    </div>
  );
};

export default MainLayout;
