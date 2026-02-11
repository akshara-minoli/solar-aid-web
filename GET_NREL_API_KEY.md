# 🔑 How to Get Your NREL API Key

## What is NREL?

The **National Renewable Energy Laboratory (NREL)** is a U.S. Department of Energy research facility that provides free APIs for renewable energy calculations, including the **PVWatts API** for solar production estimates.

---

## ⚡ Get Your Free API Key (2 minutes)

### Step 1: Visit the Signup Page

Go to: **https://developer.nrel.gov/signup/**

Or click here: [NREL Developer Signup](https://developer.nrel.gov/signup/)

### Step 2: Fill Out the Form

You'll see a simple form requesting:

```
First Name: [Your First Name]
Last Name: [Your Last Name]
Email: [your.email@example.com]
Organization: [Optional - can leave blank or put "Personal"]
```

- **No password required!**
- **No credit card needed!**
- **Completely free forever!**

### Step 3: Submit

Click the **"Sign Up"** button.

### Step 4: Check Your Email

Within seconds, you'll receive an email from NREL with:

```
Subject: NREL Developer Network API Key

Your API key for the NREL Developer Network is:

    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

To use your key, append it to API requests using the api_key parameter:

https://developer.nrel.gov/api/example?api_key=YOUR_KEY

For more information, visit:
https://developer.nrel.gov/docs/
```

### Step 5: Copy Your Key

**Your API key will look something like this:**
```
abc123DEF456ghi789JKL012mno345PQR678stu901VWX234yz
```

**Note:** This is a fake example - yours will be different!

---

## 🔧 Add API Key to Your Project

### Method 1: Manual Entry (Recommended)

1. Open your project folder
2. Navigate to `server/.env`
3. Add this line (replace with your actual key):

```env
NREL_API_KEY=your_actual_api_key_here
```

**Example:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/solar-aid

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# NREL PVWatts API Key
NREL_API_KEY=abc123DEF456ghi789JKL012mno345PQR678stu901VWX234yz
```

4. Save the file
5. Restart your server

### Method 2: Command Line

**Windows (PowerShell):**
```powershell
cd server
Add-Content .env "`nNREL_API_KEY=your_api_key_here"
```

**Mac/Linux (Terminal):**
```bash
cd server
echo "NREL_API_KEY=your_api_key_here" >> .env
```

---

## ✅ Verify It's Working

### Test 1: Check Environment Variable

**Create a test file:** `server/test-nrel.js`
```javascript
import dotenv from 'dotenv';
dotenv.config();

console.log('NREL API Key:', process.env.NREL_API_KEY);
console.log('Length:', process.env.NREL_API_KEY?.length);
console.log('Status:', process.env.NREL_API_KEY ? '✅ Found' : '❌ Missing');
```

**Run it:**
```bash
cd server
node test-nrel.js
```

**Expected output:**
```
NREL API Key: abc123DEF456...
Length: 40
Status: ✅ Found
```

### Test 2: Test API Directly

**Using cURL:**
```bash
curl "https://developer.nrel.gov/api/pvwatts/v8.json?api_key=YOUR_KEY&lat=6.9271&lon=79.8612&system_capacity=3.5&module_type=0&losses=14&array_type=1&tilt=7&azimuth=180&dataset=intl"
```

Replace `YOUR_KEY` with your actual key.

**Expected:** You should see JSON data with solar production values.

### Test 3: Test Through Your App

```bash
# Start your server
cd server
npm start

# In another terminal, test the districts endpoint
curl http://localhost:5000/api/solar/districts
```

**Expected:** You should see 25 Sri Lankan districts.

---

## 🚨 Troubleshooting

### Error: "NREL API key is not configured"

**Problem:** Server can't find your API key.

**Solutions:**
1. Check `.env` file exists in `server/` directory
2. Verify line format: `NREL_API_KEY=your_key` (no spaces, no quotes)
3. Restart server after adding key
4. Check for typos in the variable name

### Error: "Invalid API key"

**Problem:** Key is incorrect or malformed.

**Solutions:**
1. Copy key again from NREL email
2. Ensure no extra spaces at start or end
3. Request a new key from NREL
4. Check key hasn't expired (rare)

### Error: "API key required"

**Problem:** Key not being sent to NREL.

**Solutions:**
1. Verify key is in `.env` file
2. Check `dotenv.config()` is called in server.js
3. Restart the server
4. Check console for loaded environment variables

### Can't Find .env File

**Problem:** .env file doesn't exist.

**Solution:**
```bash
cd server
copy .env.example .env    # Windows
# or
cp .env.example .env      # Mac/Linux
```

Then edit the new `.env` file to add your key.

---

## 📊 API Limits

### Free Tier (What You Get)

- ✅ **Requests per hour:** 1,000
- ✅ **Requests per day:** No daily limit
- ✅ **Cost:** FREE forever
- ✅ **Features:** Full PVWatts v8 access
- ✅ **Support:** Community forums
- ✅ **Data:** Global coverage including Sri Lanka

### Is This Enough?

**For development:** More than enough!  
**For production:** Should be fine for small-medium sites.  
**1,000 requests/hour** = ~16 requests/minute

If you need more, contact NREL about commercial keys.

---

## 🔒 Security Best Practices

### ✅ DO:
- Store key in `.env` file (server-side)
- Add `.env` to `.gitignore`
- Use environment variables
- Keep key secret
- Rotate key if exposed

### ❌ DON'T:
- Commit `.env` to Git
- Put key in client-side code
- Share key publicly
- Hardcode key in source files
- Post key in screenshots

---

## 📧 NREL Email Template

If you don't receive your key, check:
1. Spam/Junk folder
2. Email address spelling
3. Email filters

**Still missing?** Contact NREL:
- Email: api.support@nrel.gov
- Form: https://developer.nrel.gov/contact/

---

## 🔄 Key Management

### Regenerate Key

If you lose your key or it gets exposed:

1. Visit: https://developer.nrel.gov/signup/
2. Use the **same email address**
3. Submit the form again
4. You'll get the **same key** back via email

Or request a new key with a different email.

### Multiple Projects

You can use the **same key** for multiple projects.  
No need for separate keys per project.

### Expiration

NREL keys **don't expire** unless:
- You violate terms of service
- You abuse the API
- NREL policy changes (rare)

---

## 📝 Quick Reference

| Item | Value |
|------|-------|
| **Signup URL** | https://developer.nrel.gov/signup/ |
| **Docs URL** | https://developer.nrel.gov/docs/solar/pvwatts/ |
| **Support Email** | api.support@nrel.gov |
| **Key Length** | ~40 characters |
| **Cost** | FREE |
| **Rate Limit** | 1,000/hour |
| **Expiration** | Never |

---

## ✨ You're All Set!

Once you have your key and added it to `.env`:

```env
NREL_API_KEY=your_actual_key_here
```

You can:
1. ✅ Calculate solar production
2. ✅ Get monthly estimates  
3. ✅ Show financial savings
4. ✅ Calculate carbon offset
5. ✅ Support all 25 districts in Sri Lanka

**Next:** Restart your server and visit `/solar-calculator`! 🌞

---

*Need help? Check `QUICK_START_SOLAR.md` or `SOLAR_API_INTEGRATION.md`*
