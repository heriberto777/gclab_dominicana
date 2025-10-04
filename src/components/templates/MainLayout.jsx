import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import ChatBot from '../molecules/ChatBot';
import { apiClient } from '../../lib/api';
import './MainLayout.css';

const MainLayout = () => {
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    const fetchWebhookUrl = async () => {
      try {
        const { data } = await apiClient.getSetting('n8n_webhook_url');
        if (data) {
          setWebhookUrl(data.value);
        }
      } catch (error) {
        console.error('Error fetching webhook URL:', error);
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
