import axios from 'axios';

export const getWeatherInsights = async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            console.warn('⚠️ OpenWeather API Key is missing - skipping weather fetch');
            return res.status(200).json({
                success: false,
                message: 'Weather API key not configured'
            });
        }

        const city = req.query.city || 'Colombo';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        const cloudCoverage = data.clouds.all;
        const solarEfficiencyScore = 100 - cloudCoverage;

        let installationRecommendation = '';
        if (solarEfficiencyScore > 70) {
            installationRecommendation = 'Excellent solar conditions';
        } else if (solarEfficiencyScore >= 40) {
            installationRecommendation = 'Moderate solar efficiency';
        } else {
            installationRecommendation = 'Low solar output expected';
        }

        const weatherInsights = {
            city: city,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            cloudCoverage: cloudCoverage,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
            solarEfficiencyScore: solarEfficiencyScore,
            installationRecommendation: installationRecommendation,
            icon: data.weather[0].icon,
            condition: data.weather[0].main
        };

        res.status(200).json({
            success: true,
            data: weatherInsights
        });
    } catch (error) {
        console.error('Weather Insights Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};
