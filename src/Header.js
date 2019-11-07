import React from 'react';
import {
  Cell,
  Text,
} from './styledComponents/appComponents';
const Header = (props) => {
    const {title} = props;
    return (
        <Cell flex={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} row={1}>
        <Text tabIndex={0}>Stream lofi hiphop videos for studying/work/etc.</Text>
        <Text tabIndex={0}>Click the button below the video to get another video.</Text>
        {title ? <Text tabIndex={0}>title: {title}</Text> : null}
      </Cell>
    )
}

export default Header;