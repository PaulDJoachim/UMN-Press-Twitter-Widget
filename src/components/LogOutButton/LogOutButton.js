import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

const LogOutButton = props => (
  <button 
    // This button shows up in multiple locations and is styled differently
    // because it's styled differently depending on where it is used, the className
    // is passed to it from it's parents through React props
    className={props.className}
    style={{width:"100%"}}
    onClick={() => props.dispatch({ type: 'LOGOUT' })}
  >
    <Typography variant='h5'>Log Out</Typography>
  </button>
);

export default connect()(LogOutButton);
