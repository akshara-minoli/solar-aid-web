# 🗺️ Where to Find Third-Party API Features in Your Website

## ✅ Solar Calculator Now Added to Your Navigation

### 🎯 How to Access the Solar Calculator (NREL API Integration)

#### **For Users (End Users):**

1. **Login to your account**
   - Go to your website homepage
   - Click "Login" button
   - Enter your credentials

2. **Navigate to Solar Calculator**
   - Look at the left sidebar menu
   - Click on **☀️ Solar Calculator** (between "Household Profile" and "Solar Reports")
   - Or use direct URL: `http://localhost:5173/#solar-calculator`

#### **Navigation Menu Structure:**

```
🏠 SOLAR AID Dashboard
├─ 📊 Overview
├─ 🏠 Household Profile
├─ ☀️ Solar Calculator      ← NEW! NREL API HERE
├─ 📈 Solar Reports
└─ 👤 My Profile
```

---

## 📍 What You'll See on the Solar Calculator Page

### Main Features:

1. **Household Selection Dropdown**
   - Select your household to analyze

2. **System Configuration**
   - System Size (kW) input
   - Electricity Rate (LKR/kWh)
   - Advanced settings (tilt angle, azimuth)

3. **Calculate Button**
   - Click to fetch data from NREL API

4. **Solar Production Report** (After calculating)
   - Annual Production (kWh)
   - Annual Savings (Rs)
   - Carbon Offset (CO₂ tons)
   - Monthly breakdown chart
   - System details

---

## 🔧 API Configuration Details

### Where API Settings Are Stored:

#### **Backend (Server-side):**

📁 **Location:** `server/.env`
```env
NREL_API_KEY=your_api_key_here
```

📁 **API Controller:** `server/controllers/solarController.js`
- Line 245: API key is retrieved
- Line 250: NREL API endpoint configured
- Line 253-264: API request parameters

📁 **API Routes:** `server/routes/solar.js`
- `POST /api/solar/calculate/:householdId`
- `GET /api/solar/estimate-size/:householdId`
- `GET /api/solar/districts`

#### **Frontend (Client-side):**

📁 **Solar Calculator Page:** `client/src/pages/SolarCalculator.jsx`
- Line 23: API URL configuration
- Line 68: Axios API call to fetch calculations
- Line 89: Axios call to solar endpoint

📁 **Report Display:** `client/src/components/SolarProductionReport.jsx`
- Displays all data returned from NREL API

---

## 🌐 Live URLs

### Local Development:

| Page | URL | Access |
|------|-----|--------|
| **Solar Calculator** | `http://localhost:5173/#solar-calculator` | Requires login |
| **Dashboard** | `http://localhost:5173/#dashboard` | Requires login |
| **API Endpoint** | `http://localhost:5000/api/solar/districts` | Public |

### Direct API Testing:

```bash
# Test districts endpoint (no auth needed)
curl http://localhost:5000/api/solar/districts

# Test calculate endpoint (requires JWT token)
curl -X POST http://localhost:5000/api/solar/calculate/HOUSEHOLD_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"systemSize": 3.5}'
```

---

## 📊 API Information Display

### On Your Website, Users Can See:

✅ **Input Parameters:**
- Household location (district)
- Roof area (m²)
- System size (kW)
- Electricity rate (LKR/kWh)
- Panel tilt angle (degrees)
- Azimuth angle (degrees)

✅ **API Results Displayed:**
- Annual energy production (kWh/year)
- Monthly production breakdown (12 months)
- Financial savings (Rs/year)
- Carbon offset (tons CO₂)
- Tree equivalency
- Capacity factor
- System performance metrics

✅ **Data Source Badge:**
The report shows: "Powered by NREL PVWatts API"

---

## 🔍 Admin/Developer View

### Where to View API Technical Details:

#### **1. Browser Developer Console**

Open browser console on the Solar Calculator page to see:
- API requests being made
- Response data from NREL
- Any errors or warnings

**How to open:**
- Windows/Linux: `F12` or `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

**What you'll see:**
```javascript
// API Request
POST http://localhost:5000/api/solar/calculate/65abc123...
Authorization: Bearer eyJhbGciOiJ...
{
  "systemSize": 3.5,
  "electricityRate": 25,
  "tiltAngle": 7,
  "azimuthAngle": 180
}

// API Response
{
  "success": true,
  "data": {
    "production": { ... },
    "financial": { ... },
    "environmental": { ... }
  }
}
```

#### **2. Server Logs**

View real-time API calls in your terminal where server is running:

```bash
cd server
npm start

# You'll see logs like:
# Solar calculation for household: 65abc123...
# Calling NREL API with params: {...}
# NREL API response received
```

#### **3. Network Tab**

In browser DevTools → Network tab:
- Filter by "XHR" or "Fetch"
- Click on `calculate` request
- View Headers, Payload, Response

---

## 📱 Mobile Access

Same navigation works on mobile:
1. Login to your account
2. Tap the hamburger menu (☰)
3. Select "☀️ Solar Calculator"
4. Fill in details and calculate

---

## 🎨 Visual Flow

```
User Flow:
─────────────────────────────────────────────────────
1. User logs in
   ↓
2. Navigates to Dashboard
   ↓
3. Clicks "☀️ Solar Calculator" in sidebar
   ↓
4. Selects household from dropdown
   ↓
5. System size auto-suggested based on roof area
   ↓
6. User adjusts parameters (optional)
   ↓
7. Clicks "Calculate Solar Production"
   ↓
8. Frontend → Backend → NREL API → Backend → Frontend
   ↓
9. Beautiful report displayed with:
   - Production estimates
   - Financial savings
   - Environmental impact
   - Monthly charts
```

---

## 📚 Documentation Links

All technical details available in project root:

| Document | Purpose | Location |
|----------|---------|----------|
| **Quick Start** | 5-min setup guide | `QUICK_START_SOLAR.md` |
| **API Guide** | Complete API docs | `SOLAR_API_INTEGRATION.md` |
| **Get API Key** | NREL key setup | `GET_NREL_API_KEY.md` |
| **Implementation** | Code overview | `IMPLEMENTATION_SUMMARY.md` |
| **This Guide** | Navigation help | `WHERE_TO_FIND_API.md` |

---

## 🎯 Quick Test

### Test if Everything is Working:

1. **Start your server:**
   ```bash
   cd server
   npm start
   ```

2. **Open your browser:**
   ```
   http://localhost:5173
   ```

3. **Login with credentials**

4. **Click "☀️ Solar Calculator" in sidebar**

5. **You should see:**
   - Household dropdown
   - System size input
   - Calculate button

6. **Select a household and click "Calculate"**

7. **Report appears with NREL API data! 🎉**

---

## 🆘 Troubleshooting

### Can't Find Solar Calculator?

✅ **Check sidebar menu** - Should be between Household Profile and Solar Reports

✅ **Refresh the page** - Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

✅ **Clear browser cache** - Might be showing old version

✅ **Check you're logged in** - Solar Calculator requires authentication

### Page Shows Error?

✅ **Check server is running** - Should be on port 5000

✅ **Verify API key** - Check `server/.env` has `NREL_API_KEY`

✅ **Check console** - Open browser DevTools for error messages

---

## 💡 Summary

**Where to find third-party API details:**

🎯 **Main Access Point:** Dashboard Sidebar → ☀️ Solar Calculator

📍 **Direct URL:** `http://localhost:5173/#solar-calculator`

🔧 **Configuration:** `server/.env` file

📊 **Technical Docs:** Project root documentation files

🛠️ **Code Location:**
- Backend: `server/controllers/solarController.js`
- Frontend: `client/src/pages/SolarCalculator.jsx`
- Routes: `server/routes/solar.js`

---

*Updated: February 12, 2026*
*Your Solar Calculator is now live and accessible! 🌞*
