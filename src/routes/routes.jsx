import Mapas from '../pages/mapa/index';
import Principal from '../pages/principal/index';
import Inicio from '../pages/inicio/index';
import Sobremi from '../pages/sobre mi/index';
import Proyectos from '../pages/proyectos destacados/index';
import Tecnologias from '../pages/tecnologias/index';
import Contacto from '../pages/contacto/index';
import Mapafide from '../pages/mapafide/index';
import Pregutas from '../pages/preguntas/index';
import Libro from '../pages/libro';



const Rutas = [
 
    { path: '/', element: <Inicio /> },
{ path: '/mapas', element: <Mapas /> },
{ path: '/principal', element: <Principal /> },
{ path: '/inicio', element: <Inicio /> },
{ path: '/sobremi', element: <Sobremi /> },
{ path: '/proyectos', element: <Proyectos /> },
{ path: '/tecnologias', element: <Tecnologias /> },
{ path: '/contacto', element: <Contacto /> },
{ path: '/mapafide', element: <Mapafide /> },
{ path: '/libroo', element: <Libro /> },
{ path: '/preguntas', element: <Pregutas /> },







    ];


export default Rutas;