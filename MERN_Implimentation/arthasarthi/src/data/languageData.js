export const LANGUAGE_DATA = {
  haryanvi: {
    name: 'Haryanvi', color: 'orange', voice: 'hi-IN', prompt: 'Haryanvi (Desi dialect)',
    dictionary: { i: 'manne', my: 'mhara', money: 'pisa', loan: 'karza', bank: 'bank', interest: 'byaaj', scheme: 'skeem', farmer: 'kisaan' },
    phrases: ['Money for seeds', 'Where is the bank?', 'Interest rate', 'Government scheme']
  },
  bhojpuri: {
    name: 'Bhojpuri', color: 'purple', voice: 'hi-IN', prompt: 'Bhojpuri language',
    dictionary: { i: 'ham', my: 'hamar', money: 'paisa', loan: 'karja', bank: 'bank', interest: 'sud', scheme: 'yojna', farmer: 'kisan' },
    phrases: ['Biya khatir paisa', 'Bank kaha ba?', 'Byaaj dar', 'Sarkari yojna']
  },
  tamil: {
    name: 'Tamil', color: 'rose', voice: 'ta-IN', prompt: 'Tamil language',
    dictionary: { i: 'naan', money: 'panam', loan: 'kadan', bank: 'vanki', interest: 'vatti', scheme: 'thittam', farmer: 'vivasaayi' },
    phrases: ['Vithaigalukku panam', 'Vanki enge?', 'Vatti vigitham', 'Arasu thittam']
  }
};

export const OFFLINE_RESPONSES = {
  default: 'Offline Mode: Contact bank manager for details.',
  keywords: { loan: 'KCC loan is best (7% interest).', kcc: 'Kisan Credit Card gives loans at low interest.', bank: 'Bank opens at 10 AM. Carry Aadhaar.' }
};
