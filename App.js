import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "b98bfb8703f93ea3ae17bb84e7e3c08f";

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [condition, setCondition] = useState("");
    const [temp, setTemp] = useState(0);

    getWeather = async (latitude, longitude) => {
        const {
            data: {
                main: { temp },
                weather,
            },
        } = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
        );
        setIsLoading(false);
        setCondition(weather[0].main);
        setTemp(temp);
    };

    getLocation = async () => {
        try {
            await Location.requestForegroundPermissionsAsync();
            const {
                coords: { latitude, longitude },
            } = await Location.getCurrentPositionAsync();
            getWeather(latitude, longitude);
        } catch (error) {
            Alert.alert("Can't find you.", "So sad");
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Weather temp={Math.round(temp)} condition={condition} />
    );
};

export default App;
