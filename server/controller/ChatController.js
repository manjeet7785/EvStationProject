const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sendMessage = async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    console.log('📨 User:', message);

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.error('OpenAI API Key not configured!');
      return res.status(500).json({
        success: false,
        message: 'Chatbot is not configured. Please add OPENAI_API_KEY to .env file.'
      });
    }

    const messages = [
      {
        role: "system",
        content: "You are Manjeet, EV Charging Station expert. Answer in simple English. Be friendly, helpful, and technical about EV charging, stations, connectors, pricing, and bookings. Example questions: 'How fast is CCS?', 'What is CHAdeMO?', 'How much does Level 2 charging cost?'"
      },
      { role: "user", content: message }
    ];

    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      chatHistory.slice(0, -1).forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 800,
      temperature: 0.7
    });

    const botResponse = completion.data.choices[0].message.content;
    console.log('🤖 Manjeet:', botResponse.substring(0, 100) + '...');

    res.json({
      success: true,
      message: botResponse.trim()
    });

  } catch (error) {
    console.error('Chat Error:', error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenAI API Key. Please check your .env file and add a valid OPENAI_API_KEY.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Sorry Manjeet is having trouble. Please try again!'
    });
  }
};

module.exports = { sendMessage };
