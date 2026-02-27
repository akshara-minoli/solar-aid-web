import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE;

// Initialize Twilio client
let client;

/**
 * Helper to clean phone numbers for Twilio (E.164 format)
 */
const formatPhone = (phone) => {
  if (!phone) return phone;
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s()-]/g, '');
  // If it doesn't start with +, Twilio might need it depending on account settings
  // But for now, we just return the cleaned version
  return cleaned;
};

try {
  if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');
  } else {
    console.warn('⚠️ Twilio credentials missing - SMS notifications will be skipped');
    client = null;
  }
} catch (error) {
  console.warn('⚠️ Twilio initialization error:', error.message);
  client = null;
}

/**
 * Send SMS notification when service is assigned to technician
 * @param {string} technicianPhone - Technician's phone number
 * @param {string} serviceName - Type of service
 * @param {string} userPhone - User's phone number
 */
export const sendServiceAssignmentSMS = async (technicianPhone, serviceName, userPhone) => {
  try {
    if (!client) {
      console.log('📱 SMS Service: Twilio not configured. Skipping SMS to technician.');
      return;
    }

    const message = await client.messages.create({
      body: `Solar Aid: New service request assigned - ${serviceName}. User Phone: ${formatPhone(userPhone)}. Please confirm ASAP.`,
      from: fromPhone,
      to: formatPhone(technicianPhone)
    });

    console.log(`✅ SMS sent to technician (${technicianPhone}): ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ Error sending SMS to technician:', error.message);
  }
};

/**
 * Send SMS notification to user about service update
 * @param {string} userPhone - User's phone number
 * @param {string} technicianName - Assigned technician name
 * @param {string} status - Current status (Assigned/In Progress/Completed)
 */
export const sendServiceUpdateToUser = async (userPhone, technicianName, status) => {
  try {
    if (!client) {
      console.log('📱 SMS Service: Twilio not configured. Skipping SMS to user.');
      return;
    }

    const message = await client.messages.create({
      body: `Solar Aid: Your service request is ${status}. Technician: ${technicianName}. We'll keep you updated.`,
      from: fromPhone,
      to: formatPhone(userPhone)
    });

    console.log(`✅ SMS sent to user (${userPhone}): ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ Error sending SMS to user:', error.message);
  }
};

/**
 * Send maintenance reminder SMS to user
 * @param {string} userPhone - User's phone number
 * @param {string} scheduledDate - Scheduled maintenance date
 * @param {string} technicianName - Assigned technician name
 */
export const sendMaintenanceReminderSMS = async (userPhone, scheduledDate, technicianName = 'Your technician') => {
  try {
    if (!client) {
      console.log('📱 SMS Service: Twilio not configured. Skipping reminder SMS.');
      return;
    }

    const formattedDate = new Date(scheduledDate).toLocaleDateString();
    const message = await client.messages.create({
      body: `Solar Aid: Maintenance reminder! Your scheduled maintenance is on ${formattedDate}. ${technicianName} will contact you soon.`,
      from: fromPhone,
      to: formatPhone(userPhone)
    });

    console.log(`✅ Maintenance reminder SMS sent to user (${userPhone}): ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ Error sending reminder SMS:', error.message);
  }
};

/**
 * Send service completion notification to user
 * @param {string} userPhone - User's phone number
 * @param {string} completionNotes - Notes about the completed service
 * @param {string} technicianName - Technician who completed service
 */
export const sendCompletionNotificationSMS = async (userPhone, completionNotes = 'Service completed successfully', technicianName = 'Your technician') => {
  try {
    if (!client) {
      console.log('📱 SMS Service: Twilio not configured. Skipping completion SMS.');
      return;
    }

    const message = await client.messages.create({
      body: `Solar Aid: Service completed by ${technicianName}! ${completionNotes}. Thank you for choosing Solar Aid!`,
      from: fromPhone,
      to: formatPhone(userPhone)
    });

    console.log(`✅ Completion SMS sent to user (${userPhone}): ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ Error sending completion SMS:', error.message);
  }
};

/**
 * Send SMS to technician about maintenance schedule confirmation
 * @param {string} technicianPhone - Technician's phone number
 * @param {string} scheduledDate - Scheduled date
 * @param {string} serviceType - Type of service
 */
export const sendScheduleConfirmationSMS = async (technicianPhone, scheduledDate, serviceType = 'Maintenance') => {
  try {
    if (!client) {
      console.log('📱 SMS Service: Twilio not configured. Skipping confirmation SMS.');
      return;
    }

    const formattedDate = new Date(scheduledDate).toLocaleDateString();
    const message = await client.messages.create({
      body: `Solar Aid: ${serviceType} scheduled for ${formattedDate}. Please confirm your availability.`,
      from: fromPhone,
      to: formatPhone(technicianPhone)
    });

    console.log(`✅ Schedule confirmation SMS sent to technician (${technicianPhone}): ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('❌ Error sending schedule confirmation SMS:', error.message);
  }
};

export default client;
