import { TextBubble } from './TextBubble';
import { VoiceBubble } from './VoiceBubble';
import type { TPhoneMessage } from './types';

type TProps = {
  message: TPhoneMessage;
  index: number;
};

/**
 * Router for the two bubble shapes supported in the phone mockup:
 *   voice (default) → <VoiceBubble> — play + waveform + duration
 *   text            → <TextBubble>  — markdown-formatted text bubble
 */
export const ChatBubble = ({ message, index }: TProps) => {
  if (message.kind === 'text') {
    return <TextBubble message={message} />;
  }
  return <VoiceBubble message={message} index={index} />;
};
