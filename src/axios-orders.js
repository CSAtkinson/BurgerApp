import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://react-burger-1d4fc-default-rtdb.firebaseio.com/'
});

export default instance;