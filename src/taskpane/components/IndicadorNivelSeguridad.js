import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  resumen: {
    textAlign:'center',
  },
  indicadorWrapper: {
    width: '100%',
    maxWidth: 768,
    margin: '0 auto',
  },
  progressBar: {
    color: 'white',
    padding: '1px 0',
    marginTop: 10,
    fontSize: '1.5em',
    border: '5px solid #FFFFFF',
    borderRadius: 25,
    position: 'relative',
  },
  progress: {
    backgroundColor: '#000000', // Color de fondo de la barra de progreso
    height: '1em',
    borderRadius: 25,
    padding: '5px 0',
    position: 'relative',
  },
  progressValue: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '0.9em',
    fontWeight: 'bold',
    textShadow: '1px  0px 0px black, 0px  1px 0px black, -1px  0px 0px black, 0px -1px 0px black',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  gridItem: {
    color: 'white',
    fontWeight: 'bold',
    padding: '20%',
    fontSize: '150%',
    textAlign: 'center',
    borderRadius: 20,
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  itemPorcentaje: {
    textShadow: '1px  0px 0px black, 0px  1px 0px black, -1px  0px 0px black, 0px -1px 0px black',
  },
  itemName: {
    textShadow: '1px  0px 0px black, 0px  1px 0px black, -1px  0px 0px black, 0px -1px 0px black',
  },
  remitente: {
    backgroundColor: '#f44336',
  },
  mensaje: {
    backgroundColor: '#ff9800',
  },
  links: {
    backgroundColor: '#e0ca00',
  },
  archivos: {
    backgroundColor: '#4CAF50',
  },
});

class IndicadorNivelSeguridad extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            colorRemitente:"",
            colorMensaje:"",
            colorLinks:"",
            colorArchivos:"",
            totVal: 0,
            safetyType: '',
        }
    }

    componentDidMount(){
        this.setState({
            colorRemitente:this.getColorByValue(this.props.scoreRemitente),
            colorMensaje:this.getColorByValue(this.props.scoreMensaje),
            colorLinks:this.getColorByValue(this.props.scoreLinks),
            colorArchivos:this.getColorByValue(this.props.scoreArchivos),
        });
        this.getData();
    }

    getColorByValue = (value) =>  {
        if (value <= 25) {
          return '#f44336'; // Rojo si el valor es 25 o menos
        } else if (value > 25 && value <= 50) {
          return '#ff9800'; // Naranja si el valor está entre 26 y 50
        } else if (value > 50 && value <= 75) {
          return '#e0ca00'; // Amarillo si el valor está entre 51 y 75
        } else {
          return '#4CAF50'; // Verde para cualquier otro valor (mayor a 75)
        }
    };

    getSafetyByValue = (value) =>  {
        if (value <= 25) {
          return 'NADA'; 
        } else if (value > 25 && value <= 50) {
          return 'POCO'; 
        } else if (value > 50 && value <= 75) {
          return 'MEDIO';
        } else {
          return 'MUY';
        }
    };
    getData = async () => {
        setTimeout(() => {
          this.totEvaluation(this.props.scoreRemitente, this.props.scoreMensaje, this.props.scoreLinks,this.props.scoreArchivos);
        }, 800)
    }

    totEvaluation = async (a,b,c,d) => {
        var numA = parseInt(a);
        var numB = parseInt(b);
        var numC = parseInt(c);
        var numD = parseInt(d);
        var value = ((numA + numB + numC + numD)/4);
        let self = this;
        var roundedScore = value.toFixed(0);
        self.setState({
          totVal: roundedScore,
          safetyType: this.getSafetyByValue(roundedScore),
        });
        self.props.onSafetyType(this.state.safetyType);
    }

    render(){
        const {classes} = this.props;
        var stylesForMiComponente = {
            remitente: {
              backgroundColor: this.getColorByValue(this.props.scoreRemitente),
            },
            mensaje: {
              backgroundColor: this.getColorByValue(this.props.scoreMensaje),
            },
            links: {
              backgroundColor: this.getColorByValue(this.props.scoreLinks),
            },
            archivos: {
              backgroundColor: this.getColorByValue(this.props.scoreArchivos),
            },
            lineaProgreso:{
              backgroundColor: this.getColorByValue(this.state.totVal),
            }
          };
        return (
            <div className={classes.indicadorWrapper}>
      <Paper className={classes.progressBar}>
        <LinearProgress
          style={stylesForMiComponente.lineaProgreso}
          className={`${classes.progress}`}
          variant="determinate"
          value={0}
        />
        <span className={classes.progressValue}>{this.state.safetyType} SEGURO</span>
      </Paper>

      <h2 className={classes.resumen}>Resumen</h2>
      <Grid container spacing={1} className={classes.grid}>
        <Grid item xs={50}>
          <Paper id="remitente" style={stylesForMiComponente.remitente} className={`${classes.gridItem} ${classes.remitente}`}>
            <div className={classes.itemPorcentaje}>{this.props.scoreRemitente}%</div>
            <div className={classes.itemName}>Remitente</div>
          </Paper>
        </Grid>
        <Grid item xs={50}>
          <Paper id="mensaje" style={stylesForMiComponente.mensaje} className={`${classes.gridItem} ${classes.mensaje}`}>
            <div className={classes.itemPorcentaje}>{this.props.scoreMensaje}%</div>
            <div className={classes.itemName}>Mensaje</div>
          </Paper>
        </Grid>
        <Grid item xs={50}>
          <Paper id="links" style={stylesForMiComponente.links} className={`${classes.gridItem} ${classes.links}`}>
            <div className={classes.itemPorcentaje}>{this.props.scoreLinks}%</div>
            <div className={classes.itemName}>Links</div>
          </Paper>
        </Grid>
        <Grid item xs={50}>
          <Paper id="archivos" style={stylesForMiComponente.archivos} className={`${classes.gridItem} ${classes.archivos}`}>
            <div className={classes.itemPorcentaje}>{this.props.scoreArchivos}%</div>
            <div className={classes.itemName}>Archivos</div>
          </Paper>
        </Grid>
      </Grid>

    </div>
        );
    }
}

IndicadorNivelSeguridad.propTypes = {
    classes: PropTypes.object.isRequired,
    scoreRemitente:PropTypes.number.isRequired, 
    scoreMensaje:PropTypes.number.isRequired,
    scoreLinks:PropTypes.number.isRequired,
    scoreArchivos:PropTypes.number.isRequired,
  };

export default withStyles(styles)(IndicadorNivelSeguridad);
