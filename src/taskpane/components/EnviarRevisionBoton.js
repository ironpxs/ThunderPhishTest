import React from 'react';
import * as ReactDOM from "react-dom";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Header from "./Header";

const styles = theme => ({
  enviarRevisionBotonWrapper: {
    color: '#f5f5f5',
    padding: 10,
    fontSize: '0.9em',
    marginLeft: '3%',
    marginRight: '3%',
    textAlign: 'justify',
  },
  botonCircular: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
    backgroundColor: 'red',
    color: 'white',
    boxShadow: '0 8px #b30000, 0 15px 25px rgba(0, 0, 0, 0.7)',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1em',
    borderRadius: 30,
    cursor: 'pointer',
   
  },
  contenedorBoton : {
    display: 'flex',
    justifyContent: 'center',
    marginTop:'4%',
  },
  botonCircularActive: {
    '&:active': {
      transform: 'translateY(7px)', // Mueve el botón hacia abajo
      boxShadow: '0 4px #000000, 0 5px 15px rgba(0, 0, 0, 0.2)', // Sombra más pequeña al presionar
    }
    },
});

class EnviarRevisionBoton extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      listItems : [],
    };
  }

  componentDidMount(){
  }

  click = async () => {
    forwardAsAttachment();
  };

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.enviarRevisionBotonWrapper}>
        Presiona el botón para enviar a revisión por el Departamento de Seguridad.
        <div className={classes.contenedorBoton}>
          <button className={`${classes.botonCircular} ${classes.botonCircularActive}`} onClick={this.click}>Reportar</button>
        </div>
      </div>
    );
  }
}

EnviarRevisionBoton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnviarRevisionBoton);

// Funciones
function GetItem() {
  var results =
    '  <GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">' +
    '    <ItemShape>' +
    '      <t:BaseShape>IdOnly</t:BaseShape>' +
    '      <t:IncludeMimeContent>true</t:IncludeMimeContent>' +
    '      <AdditionalProperties xmlns="http://schemas.microsoft.com/exchange/services/2006/types">' +
    '        <FieldURI FieldURI="item:Subject" />' +
    '      </AdditionalProperties>' +
    '    </ItemShape>' +
    '    <ItemIds>' +
    '      <t:ItemId Id="' + Office.context.mailbox.item.itemId + '" />' +
    '    </ItemIds>' +
    '  </GetItem>';

  return results;
}

function getSoapEnvelope(request) {
  // Wrap an Exchange Web Services request in a SOAP envelope.
  var result =

    '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    '               xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    '               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
    '               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
    '  <soap:Header>' +
    '    <RequestServerVersion Version="Exchange2013" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" soap:mustUnderstand="0" />' +
    '  </soap:Header>' +
    '  <soap:Body>' +

    request +

    '  </soap:Body>' +
    '</soap:Envelope>';

  return result;
}

function forwardAsAttachment() {
  Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, function (result) {
    var accessToken = result.value;
    forwardAsAttachmentFunc(accessToken);
  });
}

function forwardAsAttachmentFunc(accessToken) {

  var sendItemUrl = Office.context.mailbox.restUrl + "/v2.0/me/sendmail";

  var request = GetItem();
  var envelope = getSoapEnvelope(request);

  Office.context.mailbox.makeEwsRequestAsync(envelope, function (result) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(result.value, "text/xml");
    var values = doc.getElementsByTagName("t:MimeContent")[0].textContent;
    var subject = doc.getElementsByTagName("t:Subject")[0].textContent;


    const sendMeta = JSON.stringify({
      "Message": {
        "Subject": "PHISHING>> " + subject,
        "Body": {
          "ContentType": "Text",
          "Content": "Por favor, compruebe las actividades de phishing y háganoslo saber."
        },
        "ToRecipients": [{
          "EmailAddress": {
            "Address": "ejchoez@espol.edu.ec"
          }
        }],
        "Attachments": [
          {
            "@odata.type": "#Microsoft.OutlookServices.FileAttachment",
            "Name": subject + ".eml",
            "ContentBytes": values
          }
        ]
      },
      "SaveToSentItems": "true"
    });



    //--------------------------
    $.ajax({
      url: sendItemUrl,
      type: "POST",
      dataType: "text",
      contentType: "application/json",
      data: sendMeta,
      headers: { Authorization: "Bearer " + accessToken },
      
      success: function (info) {
        console.log(info);
        console.log("Enviado");

        ReactDOM.render(
          <div className="ms-welcome">
        <Header logo={require("../../../assets/correcto.jpg")} title={"Imagen enviado"} message="Enviado" />
      </div>,
          document.getElementById("container")
        );
      },
      error: function (jqXHR, estado, error) {
        console.log(error);
        console.log("Error el enviar");
        ReactDOM.render(
          <div className="ms-welcome">
        <Header logo={require("../../../assets/incorrecto.jpg")} title={"Imagen error"} message="Error" />
      </div>,
          document.getElementById("container")
        );
      }
    });
    //---------------------------
  });
}
