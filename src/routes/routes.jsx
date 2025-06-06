import Mapas from '../pages/mapa/index';
import Principal from '../pages/principal/index';
import Inicio from '../pages/inicio/index';
import Sobremi from '../pages/sobre mi/index';
import Proyectos from '../pages/proyectos destacados/index';
import Tecnologias from '../pages/tecnologias/index';
import Contacto from '../pages/contacto/index';

const Rutas = [
 
    { path: '/', element: <Inicio /> },
{ path: '/mapas', element: <Mapas /> },
{ path: '/principal', element: <Principal /> },
{ path: '/inicio', element: <Inicio /> },
{ path: '/sobremi', element: <Sobremi /> },
{ path: '/proyectos', element: <Proyectos /> },
{ path: '/tecnologias', element: <Tecnologias /> },
{ path: '/contacto', element: <Contacto /> },
    ];


export default Rutas;