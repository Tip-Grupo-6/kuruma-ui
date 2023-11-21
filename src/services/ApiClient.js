import axios from 'axios';

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const status = error.response?.status || 500;
    if (status === 401) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("car_id")
        window.location = window.location.protocol + "//" + window.location.host + "/login"
    } else {
        return Promise.reject(error); // Delegate error to calling side
    }
});

export default axios;