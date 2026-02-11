# Solar Irradiance API Integration Guide

## Overview

This guide explains how to use the NREL PVWatts API integration to calculate solar production estimates, savings, and environmental impact for households in Sri Lanka.

## Features

✅ Solar production estimation using NREL PVWatts API
✅ Monthly and annual energy output calculations
✅ Financial savings calculations (LKR)
✅ Carbon offset calculations (CO₂ reduction)
✅ Automatic system size recommendations based on roof area
✅ Support for all 25 districts in Sri Lanka
✅ Customizable system parameters (tilt, azimuth)

---

## 🔧 Setup Instructions

### 1. Get Your NREL API Key

1. Visit [https://developer.nrel.gov/signup/](https://developer.nrel.gov/signup/)
2. Fill out the registration form
3. You'll receive your API key via email instantly (it's free!)

### 2. Configure Environment Variables

Add your NREL API key to the server's `.env` file:

```bash
# In server/.env
NREL_API_KEY=your_nrel_api_key_here
```

**Important:** Never commit your `.env` file to version control. Use `.env.example` as a template.

### 3. Install Dependencies

The required dependencies are already in `package.json`:
- `axios` - For making HTTP requests to NREL API

If needed, install:
```bash
cd server
npm install axios
```

### 4. Start the Server

```bash
cd server
npm start
```

The solar API endpoints will be available at `http://localhost:5000/api/solar`

---

## 📡 API Endpoints

### 1. Calculate Solar Production
**POST** `/api/solar/calculate/:householdId`

Calculate solar production estimates for a specific household.

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `householdId` (string) - The MongoDB ObjectId of the household

**Request Body:**
```json
{
  "systemSize": 3.5,          // Required: System size in kW
  "electricityRate": 25,       // Optional: LKR per kWh (default: 25)
  "tiltAngle": 7,             // Optional: Panel tilt in degrees (default: 7)
  "azimuthAngle": 180         // Optional: Panel azimuth in degrees (default: 180)
}
```

**Example Request (Axios):**
```javascript
import axios from 'axios';

const calculateSolar = async (householdId, systemSize) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `http://localhost:5000/api/solar/calculate/${householdId}`,
      {
        systemSize: 3.5,
        electricityRate: 25,
        tiltAngle: 7,
        azimuthAngle: 180
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
    throw error;
  }
};
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "household": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "houseName": "My House",
      "district": "Colombo",
      "roofArea": 100
    },
    "system": {
      "size": 3.5,
      "location": {
        "lat": 6.9271,
        "lon": 79.8612,
        "district": "Colombo"
      },
      "tilt": 7,
      "azimuth": 180
    },
    "production": {
      "annualProductionKWh": 5250,
      "monthlyProductionKWh": [450, 420, 440, ...],
      "averageMonthlyKWh": 438,
      "capacityFactor": 0.171
    },
    "financial": {
      "electricityRate": 25,
      "annualSavingsLKR": 131250,
      "monthlySavingsLKR": 10938,
      "currency": "LKR"
    },
    "environmental": {
      "carbonOffsetTons": 3.41,
      "carbonOffsetKg": 3413,
      "equivalentTreesPlanted": 171
    },
    "validUntil": "2026-03-14T..."
  }
}
```

---

### 2. Estimate System Size
**GET** `/api/solar/estimate-size/:householdId`

Get recommended system sizes based on available roof area.

**Authentication:** Required (Bearer Token)

**URL Parameters:**
- `householdId` (string) - The MongoDB ObjectId of the household

**Example Request:**
```javascript
const estimateSize = async (householdId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `http://localhost:5000/api/solar/estimate-size/${householdId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
    throw error;
  }
};
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "household": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "houseName": "My House",
      "roofArea": 100
    },
    "estimation": {
      "totalRoofArea": 100,
      "usableRoofArea": 75,
      "maxSystemSize": 8.82,
      "recommendations": [
        {
          "size": 8,
          "roofAreaRequired": 68,
          "description": "Maximum recommended system size based on available roof area"
        },
        {
          "size": 5,
          "roofAreaRequired": 42.5,
          "description": "5 kW solar system"
        }
      ]
    }
  }
}
```

---

### 3. Get Available Districts
**GET** `/api/solar/districts`

Get list of all supported Sri Lankan districts with coordinates.

**Authentication:** Not required (Public endpoint)

**Example Request:**
```javascript
const getDistricts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/solar/districts');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "name": "Colombo",
      "value": "colombo",
      "coordinates": { "lat": 6.9271, "lon": 79.8612 }
    },
    {
      "name": "Kandy",
      "value": "kandy",
      "coordinates": { "lat": 7.2906, "lon": 80.6337 }
    }
    // ... 23 more districts
  ]
}
```

---

## 🎨 React Components

### SolarProductionReport Component

Display solar production estimates in a beautiful, user-friendly format.

**Props:**
- `reportData` (object) - The report data from API
- `loading` (boolean) - Show loading state
- `error` (string) - Display error message

**Usage Example:**
```jsx
import SolarProductionReport from '../components/SolarProductionReport';

function MyComponent() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <SolarProductionReport 
      reportData={reportData}
      loading={loading}
      error={error}
    />
  );
}
```

### SolarCalculator Page

Full page component with form inputs and report display.

**Features:**
- Household selection dropdown
- System size input with recommendations
- Customizable electricity rate
- Advanced settings (tilt, azimuth)
- Real-time calculation
- Beautiful report display

**Usage:**
```jsx
// In your router (e.g., App.jsx)
import SolarCalculator from './pages/SolarCalculator';

<Route path="/solar-calculator" element={<SolarCalculator />} />
```

---

## 📊 Calculation Details

### System Performance

The API calculates solar production using NREL's PVWatts model, which considers:
- Geographic location (latitude/longitude)
- Solar irradiance data for Sri Lanka
- System capacity (kW)
- Panel tilt and azimuth angles
- System losses (14% default)
- Module type (Standard)
- Array type (Fixed roof-mount)

### Financial Calculations

**Annual Savings:**
```
Annual Savings (LKR) = Annual Production (kWh) × Electricity Rate (LKR/kWh)
```

**Default Electricity Rate:** Rs 25/kWh (Sri Lankan average)

### Environmental Impact

**Carbon Offset:**
```
CO₂ Reduction (kg) = Annual Production (kWh) × 0.65 kg CO₂/kWh
```

The 0.65 kg CO₂/kWh factor is the emission factor for Sri Lanka's electricity grid.

**Tree Equivalent:**
```
Trees Planted ≈ Carbon Offset (tons) × 50 trees/ton
```

---

## 🛠️ Error Handling

### Common Errors

1. **Missing API Key**
   ```json
   {
     "success": false,
     "message": "NREL API key is not configured. Please add NREL_API_KEY to your .env file"
   }
   ```
   **Solution:** Add your NREL API key to `.env` file

2. **Invalid Household**
   ```json
   {
     "success": false,
     "message": "Household not found"
   }
   ```
   **Solution:** Verify the household ID exists and belongs to the user

3. **District Not Found**
   ```json
   {
     "success": false,
     "message": "Coordinates not found for district: XYZ"
   }
   ```
   **Solution:** Use one of the supported districts from `/api/solar/districts`

4. **NREL API Error**
   ```json
   {
     "success": false,
     "message": "NREL API Error (401): Invalid API key"
   }
   ```
   **Solution:** Check your API key is correct and active

---

## 🌍 Supported Districts

All 25 districts of Sri Lanka are supported:

| Province | Districts |
|----------|-----------|
| Western | Colombo, Gampaha, Kalutara |
| Central | Kandy, Matale, Nuwara Eliya |
| Southern | Galle, Matara, Hambantota |
| Northern | Jaffna, Kilinochchi, Mannar, Vavuniya, Mullaitivu |
| Eastern | Batticaloa, Ampara, Trincomalee |
| North Western | Kurunegala, Puttalam |
| North Central | Anuradhapura, Polonnaruwa |
| Uva | Badulla, Moneragala |
| Sabaragamuwa | Ratnapura, Kegalle |

---

## 🔒 Security Best Practices

1. **Never expose your NREL API key in client-side code**
   - Always call the API from your backend
   - Store the key in `.env` file (server-side only)

2. **Use authentication for all endpoints**
   - Protect routes with JWT middleware
   - Verify user owns the household before calculations

3. **Rate limiting**
   - NREL API has rate limits (check your plan)
   - Consider caching results for repeated requests
   - Store calculations in database for 30 days

4. **Input validation**
   - Validate all user inputs on the backend
   - Check system size is reasonable (0.1 - 100 kW)
   - Verify district names match supported list

---

## 📝 Example Integration in Existing Pages

### Update SolarReports.jsx

```jsx
import { useNavigate } from 'react-router-dom';

function SolarReports() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/solar-calculator')}>
        Calculate New Report
      </button>
    </div>
  );
}
```

### Add to Dashboard Navigation

```jsx
// In DashboardLayout.jsx or Navbar.jsx
<Link to="/solar-calculator">
  <span>☀️ Solar Calculator</span>
</Link>
```

---

## 🧪 Testing

### Test with cURL

```bash
# Get districts (public endpoint)
curl http://localhost:5000/api/solar/districts

# Calculate solar production (requires auth)
curl -X POST http://localhost:5000/api/solar/calculate/HOUSEHOLD_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "systemSize": 3.5,
    "electricityRate": 25,
    "tiltAngle": 7,
    "azimuthAngle": 180
  }'
```

### Test with Postman

1. Create a new POST request
2. URL: `http://localhost:5000/api/solar/calculate/:householdId`
3. Headers:
   - `Authorization`: `Bearer YOUR_TOKEN`
   - `Content-Type`: `application/json`
4. Body (JSON):
   ```json
   {
     "systemSize": 3.5,
     "electricityRate": 25
   }
   ```

---

## 📚 Additional Resources

- [NREL PVWatts Documentation](https://developer.nrel.gov/docs/solar/pvwatts/v8/)
- [Sri Lanka Solar Energy Statistics](https://www.energy.gov.lk/)
- [Carbon Emission Factors](https://www.ipcc.ch/)

---

## 🐛 Troubleshooting

**Problem:** "NREL API key is not configured"
- Check `.env` file exists in `/server` directory
- Verify `NREL_API_KEY=...` is set (no quotes needed)
- Restart the server after adding the key

**Problem:** Network requests fail
- Ensure server is running on port 5000
- Check CORS settings in `server.js`
- Verify firewall allows outbound HTTPS to NREL API

**Problem:** Results seem incorrect
- Verify household district is set correctly
- Check system size is in kW (not W)
- Ensure electricity rate is in LKR per kWh
- Try different tilt/azimuth angles

---

## 💡 Tips for Optimization

1. **Cache results**: Store calculations in MongoDB for faster repeated access
2. **Batch requests**: If calculating for multiple households, use Promise.all()
3. **Error retry**: Implement exponential backoff for API failures
4. **Progressive loading**: Show partial results as they become available
5. **Offline mode**: Store recent calculations for offline viewing

---

## 📞 Support

For issues related to:
- **NREL API**: Contact NREL Support at [https://developer.nrel.gov/contact/](https://developer.nrel.gov/contact/)
- **This Integration**: Check API logs in server console
- **Solar Calculations**: Consult with certified solar installers in Sri Lanka

---

*Last Updated: February 12, 2026*
