import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE;

// Initialize Twilio client
let client;

// Modified for WhatsApp Sandbox (Trial Account Friendly)
const formatPhone = (phone) => {
  if (!phone) return phone;
  let cleaned = phone.toString().replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    if (!cleaned.startsWith('94')) cleaned = '94' + cleaned;
    cleaned = '+' + cleaned;
  }
  // For WhatsApp, we MUST prefix with 'whatsapp:'
  return `whatsapp:${cleaned}`;
};

const whatsappFrom = 'whatsapp:+14155238886'; // Your Sandbox WhatsApp Number

try {
  if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio WhatsApp Client initialized successfully');
  } else {
    console.warn('⚠️ Twilio credentials missing - WhatsApp notifications will be skipped');
    client = null;
  }
} catch (error) {
  console.warn('⚠️ Twilio initialization error:', error.message);
  client = null;
}

/**
 * Send WhatsApp notification when service is assigned
 */
export const sendServiceAssignmentSMS = async (technicianPhone, serviceName, userPhone) => {
  try {
    if (!client) return;
    const to = formatPhone(technicianPhone);
    const message = await client.messages.create({
      body: `Solar Aid: New service assigned - ${serviceName}. User Phone: ${userPhone}. Confirm ASAP!`,
      from: whatsappFrom,
      to: to
    });
    console.log(`✅ WhatsApp sent: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ WhatsApp Error (Assign):', error.message);
  }
};

/**
 * Send WhatsApp notification to user about status
 */
export const sendServiceUpdateToUser = async (userPhone, technicianName, status) => {
  try {
    if (!client) return;
    const to = formatPhone(userPhone);
    const message = await client.messages.create({
      body: `Solar Aid: Your service request is ${status}. Tech: ${technicianName}`,
      from: whatsappFrom,
      to: to
    });
    console.log(`✅ WhatsApp sent: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ WhatsApp Error (Update):', error.message);
  }
};

/**
 * Send maintenance reminder WhatsApp
 */
export const sendMaintenanceReminderSMS = async (userPhone, scheduledDate, technicianName = 'Your technician') => {
  try {
    if (!client) return;
    const to = formatPhone(userPhone);
    const formattedDate = new Date(scheduledDate).toLocaleDateString();
    const message = await client.messages.create({
      body: `Solar Aid: Maintenance reminder! Scheduled for ${formattedDate}. ${technicianName} will contact you soon.`,
      from: whatsappFrom,
      to: to
    });
    console.log(`✅ WhatsApp sent: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ WhatsApp Error (Reminder):', error.message);
  }
};

/**
 * Send service completion WhatsApp
 */
export const sendCompletionNotificationSMS = async (userPhone, completionNotes = 'Success', technicianName = 'Your technician') => {
  try {
    if (!client) return;
    const to = formatPhone(userPhone);
    const message = await client.messages.create({
      body: `Solar Aid: Service completed by ${technicianName}! ${completionNotes}`,
      from: whatsappFrom,
      to: to
    });
    console.log(`✅ WhatsApp sent: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ WhatsApp Error (Complete):', error.message);
  }
};

/**
 * Send WhatsApp schedule confirmation to technician
 */
export const sendScheduleConfirmationSMS = async (technicianPhone, scheduledDate, serviceType = 'Maintenance') => {
  try {
    if (!client) return;
    const to = formatPhone(technicianPhone);
    const formattedDate = new Date(scheduledDate).toLocaleDateString();
    const message = await client.messages.create({
      body: `Solar Aid: ${serviceType} scheduled for ${formattedDate}. Confirm availability.`,
      from: whatsappFrom,
      to: to
    });
    console.log(`✅ WhatsApp sent: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ WhatsApp Error (Confirm):', error.message);
  }
};

export default client;
