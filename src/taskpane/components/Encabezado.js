import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  encabezadoWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#380101',
    backgroundOrigin: 'padding-box',
    border: '1px solid #850101',
  },
  imgLogo: {
    display: 'block',
    width: '20%',
    objectFit: 'contain',
    paddingBottom: 0,
    margin: '1%',
  },
  nombreLogo: {
    display: 'block',
    textAlign: 'center',
    color: '#ffffff',
    height: '100%',
    width: '100%',
    fontSize: '2em',
    padding: 0,
    margin: '1%',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#850101',
    fontWeight: 'bold',
  },
});

const Encabezado = ({ classes }) => {
  return (
    <div className={classes.encabezadoWrapper}>
      <img className={classes.imgLogo} src="assets\logo-filled.png" alt="Logo" />
      <p className={classes.nombreLogo}>Thunder Phish</p>
    </div>
  );
};

export default withStyles(styles)(Encabezado);
