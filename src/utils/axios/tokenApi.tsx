import axios from 'axios';


const tokenApi = axios.create({
  baseURL: "https://morrow.hashim-dev007.online/",
  withCredentials: true,
});


tokenApi.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken){
      config.headers.Authorization = `Bearer ${accessToken}` ;
    }
    return config;
  },(error)=>{
    return Promise.reject(error);
  });


  tokenApi.interceptors.response.use((response)=>response,(error)=>{
    if(error.response && error.response.status == 400 && error.response.data.message === 'Token not provided'){
        console.log('token is not provided');
        return error.response;
    }
  })

  export {tokenApi};