import axios from "axios"
//const url =require ('./url')


const baseUrl = 'http://localhost:4000/'+'f1/'

//const baseUrl = 'http://esme.cuquicalvano.com:4000/cursos/'
//const  baseUrl ='http://localhost:4000/cursos/'



const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
/////loggedUserJSON Recupera lasesion el tokeny lo envia mediante la constante config. el back lo filtra 
 let config = ''

 if (loggedUserJSON) {

  try {
      const userContext = JSON.parse(loggedUserJSON)
      config = {
         headers:{
             Authorization:`Bearer ${userContext.token}`
         }
     }
  } catch (error) {
        window.localStorage.removeItem('loggedNoteAppUser')
   
  }
 
EPSG:5347
  
}else{
   config = {
      headers:{
          Authorization:`Bearer `
      }
  }
}



const traercanchas = async () => {
  
  // const data = await axios.post('http://localhost:4000/signupp', datos)
    const {data} = await axios.get(baseUrl+'traercanchas/', config)
  

return data
}

const preguntar = async (texto) => {
  console.log(texto)
  const res = await axios.post(`${baseUrl}/preguntar`, { texto });
  return res.data;
};








export default {preguntar}
