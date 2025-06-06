import Mapas from '../pages/mapa/index';
import Principal from '../pages/principal/index';


const Rutas = [
 
    { path: '/', element: <Mapas /> },
{ path: '/mapas', element: <Mapas /> },
{ path: '/principal', element: <Principal /> },

    ];


export default Rutas;