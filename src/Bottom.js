import React from 'react';
import {
  Cell,
  StyledButton
} from './styledComponents/appComponents';
const Bottom = (props) => {
    const {errors, isLoading, switchVideoCallback} = props;

    return(
    !isLoading ?
        <Cell flex={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={'flex-start'} row={3}>
          {!errors ? 
          <StyledButton onClick={() => switchVideoCallback}>Watch Another Video</StyledButton> : null }
        </Cell> : null
    )
}

export default Bottom;