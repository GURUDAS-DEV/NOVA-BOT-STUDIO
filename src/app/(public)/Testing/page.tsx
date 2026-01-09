'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const TestingPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }


  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/testing/TestBot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: userMessage.text, botId : '694a3ddf67f8bdb3a89c5dd6' }),
        })
        const data = await response.json();
        if (!response.ok) {
            console.log('API response error:', data);
            return;
        }

        const {message} = data;

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: message,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error calling API:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col  bg-gray-50 dark:bg-slate-950 p-4 font-outfit">
      <div className="max-w-4xl mx-auto w-full mt-28 mb-28 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bot Testing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Test your bot responses here</p>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>Start a conversation with your bot</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 dark:bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === 'user'
                          ? 'text-blue-100 dark:text-blue-200'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  <span>Bot is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-800">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-6"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TestingPage
