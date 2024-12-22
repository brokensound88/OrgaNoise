import React from 'react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <Section className="py-16">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" variant="primary">
              Send Message
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-500 mr-3" />
              <span>London, UK</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-500 mr-3" />
              <a href="mailto:contact@organoise.com" className="hover:text-blue-500">
                contact@organoise.com
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-blue-500 mr-3" />
              <a href="tel:+442012345678" className="hover:text-blue-500">
                +44 20 1234 5678
              </a>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}