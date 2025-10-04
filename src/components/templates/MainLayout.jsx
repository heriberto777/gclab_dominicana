import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import ChatBot from '../molecules/ChatBot';
import { apiClient } from '../../lib/api';
import './MainLayout.css';

const MainLayout = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [chatbotEnabled, setChatbotEnabled] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [webhookData, chatbotData] = await Promise.all([
          apiClient.getSetting('n8n_webhook_url'),
          apiClient.getSetting('chatbot_enabled')
        ]);

        if (webhookData?.data) {
          setWebhookUrl(webhookData.data.value);
        }

        if (chatbotData?.data) {
          setChatbotEnabled(chatbotData.data.value === 'true');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      {chatbotEnabled && webhookUrl && <ChatBot webhookUrl={webhookUrl} />}
    </div>
  );
};

export default MainLayout;
