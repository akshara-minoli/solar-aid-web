# 🚀 Quick Start Guide - Solar API Integration

## Setup in 5 Minutes

### Step 1: Get NREL API Key (2 minutes)
1. Go to: https://developer.nrel.gov/signup/
2. Enter your name and email
3. Check your email for the API key (arrives instantly)

### Step 2: Configure Server (1 minute)
```bash
# Navigate to server directory
cd server

# Add your API key to .env file
echo "NREL_API_KEY=your_api_key_here" >> .env
```

Or manually edit `server/.env`:
```env
NREL_API_KEY=your_actual_api_key_here
```

### Step 3: Install Dependencies (1 minute)
```bash
# In server directory
npm install

# This will install axios if not already present
```

### Step 4: Start Server (30 seconds)
```bash
# In server directory
npm start
```

You should see: `Server running on http://localhost:5000`

### Step 5: Test the API (30 seconds)
```bash
# Test if districts endpoint works (no auth required)
curl http://localhost:5000/api/solar/districts
```

You should see a list of 25 Sri Lankan districts!

---

## 🎯 Quick Test

### Option A: Use the React Component (Recommended)

1. **Add route to your app:**

Edit [client/src/App.jsx](client/src/App.jsx):
```jsx
import SolarCalculator from './pages/SolarCalculator';

// Add this route
<Route path="/solar-calculator" element={<SolarCalculator />} />
```

2. **Navigate to the page:**
```
http://localhost:5173/solar-calculator
```

3. **Test it:**
   - Log in to your account
   - Select a household
   - Enter system size (e.g., 3.5 kW)
   - Click "Calculate Solar Production"
   - View your report! 🎉

### Option B: Test with API directly

**Get your auth token:**
```jsx
// In browser console (after logging in)
console.log(localStorage.getItem('token'));
```

**Make a test request:**
```bash
# Replace YOUR_TOKEN and HOUSEHOLD_ID
curl -X POST http://localhost:5000/api/solar/calculate/HOUSEHOLD_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"systemSize": 3.5, "electricityRate": 25}'
```

---

## 📋 What You Get

After successful calculation, you'll see:

✅ **Annual Production:** Total kWh generated per year  
✅ **Monthly Breakdown:** Production for each month  
✅ **Financial Savings:** How much money you'll save (in LKR)  
✅ **Carbon Offset:** CO₂ reduction (in tons)  
✅ **Tree Equivalent:** How many trees this equals  
✅ **Beautiful Charts:** Visual monthly production graph  

---

## 🎨 Integration Examples

### Example 1: Add to Dashboard

```jsx
// In UserDashboard.jsx
import { Link } from 'react-router-dom';

<div className="dashboard-card">
  <h3>☀️ Solar Calculator</h3>
  <p>Estimate your solar savings</p>
  <Link to="/solar-calculator">
    <button>Calculate Now</button>
  </Link>
</div>
```

### Example 2: Add to Navbar

```jsx
// In Navbar.jsx
<Link to="/solar-calculator" className="nav-link">
  <span>☀️ Solar Calculator</span>
</Link>
```

### Example 3: Embed in Household View

```jsx
// In ViewHousehold.jsx
import { useState } from 'react';
import SolarProductionReport from '../components/SolarProductionReport';
import axios from 'axios';

function ViewHousehold() {
  const [reportData, setReportData] = useState(null);
  
  const calculateSolar = async () => {
    const response = await axios.post(
      `http://localhost:5000/api/solar/calculate/${householdId}`,
      { systemSize: 3.5 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReportData(response.data.data);
  };

  return (
    <div>
      {/* Your existing household info */}
      
      <button onClick={calculateSolar}>
        Calculate Solar Production
      </button>
      
      <SolarProductionReport reportData={reportData} />
    </div>
  );
}
```

---

## 🔧 Troubleshooting

### "NREL API key is not configured"
**Fix:** Add `NREL_API_KEY=your_key` to `server/.env` and restart server

### "Household not found"
**Fix:** Make sure you're logged in and using a valid household ID

### Server won't start
**Fix:** 
```bash
cd server
npm install axios
npm start
```

### Can't see the calculator page
**Fix:** Add the route to your App.jsx router

### Network error / CORS issue
**Fix:** Check that:
- Server is running on port 5000
- Client is running on port 5173/5174/5175
- CORS is configured in server.js (already done!)

---

## 📱 Example Output

When you run a calculation, you'll get results like:

```
☀️ Solar Production Report
My House - Colombo
System Size: 3.5 kW | Roof Area: 100 m²

┌─────────────────────────────────┐
│ Annual Production: 5,250 kWh    │
│ Annual Savings: Rs 131,250      │
│ Carbon Offset: 3.41 tons CO₂    │
│ Tree Equivalent: 171 trees      │
└─────────────────────────────────┘

Monthly Production:
Jan: 450 | Feb: 420 | Mar: 440 | Apr: 435
May: 430 | Jun: 425 | Jul: 445 | Aug: 440
Sep: 435 | Oct: 440 | Nov: 445 | Dec: 445
```

---

## 🎓 Next Steps

1. **Customize the UI** - Edit SolarProductionReport.jsx to match your design
2. **Add to Navigation** - Make it easy for users to find
3. **Save Results** - Store calculations in MongoDB for history
4. **Add Comparisons** - Compare different system sizes
5. **Export Reports** - Add PDF export functionality
6. **Email Reports** - Send results via email

---

## 📚 Full Documentation

For complete API reference, advanced features, and detailed explanations, see:
- [SOLAR_API_INTEGRATION.md](SOLAR_API_INTEGRATION.md) - Complete documentation

---

## 🆘 Need Help?

1. Check the full documentation
2. Look at the example page: `client/src/pages/SolarCalculator.jsx`
3. Review the API controller: `server/controllers/solarController.js`
4. Check server logs for errors

---

**Ready to go solar? 🌞⚡**
