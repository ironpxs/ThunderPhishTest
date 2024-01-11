import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as ReactDOM from "react-dom";
import Header from "./Header";

const styles = theme => ({
  msWelcome :{
    backgroundColor:"#000000",
  },
  detallesBotonWrapperD: {
    color: '#f5f5f5',
    padding: 10,
    fontSize: '0.9em',
    marginLeft: '3%',
    marginRight: '3%',
    textAlign: 'justify',
  },
  botonCircularD: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
   
    backgroundColor: '#2196F3',
    color: 'white',
    boxShadow: '0 8px #004eb3, 0 15px 25px rgba(0, 0, 0, 0.7)',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1em',
    borderRadius: 30,
    cursor: 'pointer',
    
  },
  contenedorBotonD : {
    display: 'flex',
    justifyContent: 'center',
    marginTop:'4%',
  },
  botonCircularActiveD: {
    '&:active': {
      transform: 'translateY(7px)', // Mueve el botón hacia abajo
      boxShadow: '0 4px #000000, 0 5px 15px rgba(0, 0, 0, 0.2)', // Sombra más pequeña al presionar
    }
    },
});

class DetallesBoton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount(){
  }
  

  click = async () => {
    console.log("Dio clic en detalles");
    let dataJson = this.props.dataJson;
    let newDataJson = make_prompt(dataJson);
    generateSum(newDataJson);
    console.log("Esto es después del generate json")
  };

  
  render(){
    const { classes } = this.props;
    return (
        <div className={classes.detallesBotonWrapperD}>
        Presiona el botón para leer la explicación generada por OpenAI.
        <div className={classes.contenedorBotonD}>
          <button className={`${classes.botonCircularD} ${classes.botonCircularActiveD}`} onClick={this.click}>Detalles</button>
        </div>
      </div>
    );
  }
}

DetallesBoton.propTypes = {
  classes: PropTypes.object.isRequired,
  dataJson: PropTypes.shape({
    porcentajeGeneral: PropTypes.number.isRequired,
    nivelSeguridad: PropTypes.string.isRequired,
    nombreRemitente: PropTypes.string.isRequired,
    correoRemitente: PropTypes.string.isRequired,
    puntajeRemitente: PropTypes.number.isRequired,
    nombreUsuario: PropTypes.string.isRequired,
    listaPalabrasSospechosas: PropTypes.arrayOf(PropTypes.string).isRequired,
    puntajeMensaje: PropTypes.number.isRequired,
    listaLinks: PropTypes.arrayOf(PropTypes.string).isRequired,
    puntajeLinks:PropTypes.number.isRequired,
    cantArchivos:PropTypes.number.isRequired,
    listaArchivos:PropTypes.arrayOf(PropTypes.string).isRequired,
    puntajeArchivos:PropTypes.number.isRequired,
  })
};

export default withStyles(styles)(DetallesBoton);

function make_prompt(dataJson) {
  console.log("Anterior Json");
  console.log(dataJson);
  let promptText = `El correo puede ser clasificado en 4 niveles de seguridad.
  1. MUY SEGURO
  2. MEDIO SEGURO
  3. POCO SEGURO
  4. NADA SEGURO
  
  El correo actual, obtuvo un nivel de seguridad de ${dataJson["porcentajeGeneral"]}%, considerando 0% (menos seguro) - 100% (más seguro) y lo se clasificó como: ${dataJson["nivelSeguridad"]} SEGURO.
  
  A continuación te voy a dar indicadores de 4 categorías:
  1. Remitente
  2. Mensaje
  3. Links
  4. Archivos
  
  Cada una de ellas fueron evaluadas basadas en un criterio de evaluación y yo te voy a facilitar la información para que independientemente de cualquier correo puedas explicar al usuario las razones de por qué su correo tiene el nivel de seguridad antes mencionado.
  
  1. Remitente
  Criterio de evaluación:
  Compara el nombre mostrado del remitente con su dirección de correo electrónico y revisa similitudes en palabras/dominio/nombre. Las empresas profesionales suelen incluir nombres de empresas/empleados en sus direcciones de correo electrónico.
  
  Información en correo:
  Nombre del remitente: ${dataJson["nombreRemitente"]}
  Correo del remitente: ${dataJson["correoRemitente"]}
  Puntaje: ${dataJson["puntajeRemitente"]}%
  
  2. Mensaje
  Criterio de evaluación:
  Los correos electrónicos de phishing suelen ser anónimos y no se dirigen al receptor. No suelen contener ninguna prueba de relación, como conocer el nombre del receptor.
  Es muy común que los correos electrónicos que contienen ciertas palabras relacionadas con la urgencia, el miedo, los cambios de nombre de usuario/contraseña o la pérdida/ganancia económica sea algún tipo de correo electrónico de phishing que intenta obtener su información personal.
  
  Información del correo:
  Nombre del usuario: ${dataJson["nombreUsuario"]}
  Nombre del remitente: ${dataJson["nombreRemitente"]}
  Lista de palabras sospechosas detectadas: ${dataJson["listaPalabrasSospechosas"]}
  Puntaje: ${dataJson["puntajeMensaje"]}%
  
  3. Links
  Criterio de evaluación:
  Los sitios web legítimos suelen tener el nombre de su empresa en el nombre que muestran, el dominio de correo electrónico y los enlaces. Si no es así, probablemente se trate de alguien que intenta imitar a la empresa.
  
  El Protocolo Seguro de Transferencia de Hipertexto (HTTPS) es una extensión del Protocolo de Transferencia de Hipertexto (HTTP). Se utiliza para la comunicación segura a través de una red informática, y es ampliamente utilizado en Internet. Si un enlace no utiliza https, se considera inseguro.
  
  Algunos enlaces contienen redireccionamiento. Esto significa que en lugar de que el enlace le lleve a una página web legítima, el enlace redirige a otro lugar.
  
  Información del correo:
  Nombre del remitente: ${dataJson["nombreRemitente"]}
  Correo del remitente: ${dataJson["correoRemitente"]}
  Links: ${dataJson["listaLinks"]}
  Puntaje: ${dataJson["puntajeLinks"]}%
  
  4. Archivos
  Criterio de evaluación:
  En el correo pueden llegar archivos adjuntos, que pueden contener carga maliciosa. Entre las extensiones más comunes se tienen las siguientes: ['.exe', '.bat', '.js', '.html', '.zip', '.php', '.vs', '.ps']. Por otro lado, el simple hecho de que exista uno o más archivos, aunque no tengan extensiones consideradas maliciosas, se debe tener en cuenta para revisión. Y por último, si no hay archivos, no existe problema en esta categoría.
  
  Información del correo:
  Cantidad de archivos: ${dataJson["cantArchivos"]}
  Archivos sospechosos: ${dataJson["listaArchivos"]}
  Puntaje: ${dataJson["puntajeArchivos"]}%
  
  Redacta una explicación, en 20 líneas, de fácil lectura para cualquier persona que no entiende de ciberseguridad sobre las causas de que su correo podría ser o no malicioso. Recuerda, en 20 líneas debe ser la respuesta.`;
  let newDataJson = {...dataJson, prompt:promptText}
  console.log("Nuevo Json")
  console.log(newDataJson);
  return newDataJson;
}

function generateSum(newDataJson){
  console.log("Entró a generate json")
  const apiKey = process.env.API_KEY;
  $.ajax({
    url: 'https://api.openai.com/v1/completions',
    type: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    data: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          "role": "system",
          "content": "Eres un experto en ciberseguridad."
        },
        {
          "role": "user",
          "content": newDataJson["prompt"]
        },
      ],
      temperature: 0,
      max_tokens: 50,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
    success: function(data) {
      // Manejar la respuesta exitosa aquí
      console.log(data);
    },
    error: function(error) {
      // Manejar errores aquí
      console.error('Error en la solicitud AJAX:', error);
    }
  });
  
}