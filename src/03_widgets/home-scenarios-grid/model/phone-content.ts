import type { TPhoneMessage } from '@/entities/phone-mockup';

export type TScenarioPhoneContent = {
  botName: string;
  messages: TPhoneMessage[];
};

export const SCENARIO_PHONE_CONTENT: Record<string, TScenarioPhoneContent> = {
  landlord: {
    botName: 'Michael (Landlord)',
    messages: [
      { from: 'bot', kind: 'text', text: "Hello, it's Michael your landlord. What's going on?" },
      { from: 'me', kind: 'text', text: "Hi, the heating hasn't worked since yesterday. It's really cold." },
      { from: 'bot', kind: 'text', text: "I'll send an engineer tomorrow morning. Does 9–11 work?" },
    ],
  },
  gp: {
    botName: 'City Road Surgery',
    messages: [
      { from: 'bot', kind: 'text', text: 'Good morning, City Road Surgery. How can I help?' },
      { from: 'me', kind: 'text', text: "I'd like an appointment — sore throat and fever for three days." },
      { from: 'bot', kind: 'text', text: "We have a slot tomorrow at 9:40 with Dr. Patel. Shall I book that?" },
    ],
  },
  interview: {
    botName: 'Sarah — HR, TechCorp',
    messages: [
      { from: 'bot', kind: 'text', text: 'Great to meet you! Can you tell me a bit about yourself?' },
      { from: 'me', kind: 'text', text: "Of course. I've worked in customer support for five years, mostly in SaaS." },
      { from: 'bot', kind: 'text', text: 'And what made you apply for this particular role at TechCorp?' },
    ],
  },
  smalltalk: {
    botName: 'Jamie (colleague)',
    messages: [
      { from: 'bot', kind: 'text', text: 'Morning! You look tired. Good weekend?' },
      { from: 'me', kind: 'text', text: 'Not bad — went to Borough Market on Saturday. Have you been?' },
      { from: 'bot', kind: 'text', text: 'Oh yes, love it there. Did you try the raclette stall?' },
    ],
  },
  official: {
    botName: 'HMRC Helpline',
    messages: [
      { from: 'bot', kind: 'text', text: 'Thank you for calling HMRC. For security, may I take your National Insurance number?' },
      { from: 'me', kind: 'text', text: "Sure, it's AB 12 34 56 C." },
      { from: 'bot', kind: 'text', text: 'Thank you. And your date of birth, please?' },
    ],
  },
  school: {
    botName: "Mrs. Clarke — Emma's Teacher",
    messages: [
      { from: 'bot', kind: 'text', text: "Good evening! Emma has been doing really well in English this term." },
      { from: 'me', kind: 'text', text: 'Are there areas she should work on at home?' },
      { from: 'bot', kind: 'text', text: "Her reading is strong — she could practise speaking up more in class discussions." },
    ],
  },
  workcoach: {
    botName: 'Tom — UC Work Coach',
    messages: [
      { from: 'bot', kind: 'text', text: "Hi! Let's have a look at your journal. How many applications this week?" },
      { from: 'me', kind: 'text', text: 'Four — two on Indeed, one LinkedIn, one direct to the company.' },
      { from: 'bot', kind: 'text', text: 'Good work. Any responses yet?' },
    ],
  },
  pharmacy: {
    botName: 'Boots Pharmacist',
    messages: [
      { from: 'bot', kind: 'text', text: 'Hello! How can I help you today?' },
      { from: 'me', kind: 'text', text: 'I have a prescription for amoxicillin — can I collect it here?' },
      { from: 'bot', kind: 'text', text: 'Of course. Your name and date of birth, please?' },
    ],
  },
};
