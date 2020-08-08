import axios from 'axios'

axios.interceptors.request.use(request=>{
    request.url = request.url+'.json'
    return request;
});

axios.interceptors.response.use(response=>{
    return response.data;
});

export default axios;