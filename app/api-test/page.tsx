'use client';

import { NavigationHeader } from '@/components/navigation-header-student';
import { ApiKeyChecker } from '@/components/api-key-checker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Settings } from 'lucide-react';

export default function ApiTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <Settings className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-blue-600" />
            API Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Setup dan test konfigurasi API untuk mengaktifkan fitur AI</p>
        </div>

        <div className="space-y-6">
          <ApiKeyChecker />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Status Fitur AI</span>
              </CardTitle>
              <CardDescription>Status aktivasi fitur-fitur AI pada platform EduGenAI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Virtual Tutor</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Menunggu API Key
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Content Generator</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Menunggu API Key
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">AI Chat Assistant</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Menunggu API Key
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Smart Recommendations</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Menunggu API Key
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
