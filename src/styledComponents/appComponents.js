import YouTube from 'react-youtube';
import styled from "styled-components";
export const Grid = styled.div`
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));;
  grid-template-rows: 250px 1fr 1fr;
`
export const Cell = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  grid-row-start:${props => props.row ? props.row : "1"};
  grid-column-start:2;
  marginBottom:15px;
`;

export const VideoWrapper = styled(Cell)`
    overflow: hidden;
    position: relative;
    padding-top:25px;
    padding-bottom:56.25%;
    height: 0px;
    flex-basis:500px;
`;

export const ResponsiveIframe = styled(YouTube)`
    position: absolute;
	  top: 0;
    left: 0;
    width: 100%;
	  height: 100%;
`;

export const Text = styled.p`
    color:#eeeeee;
    margin-top:15px;
`;

export const StyledButton = styled.button`
  padding:15px;
  cursor:pointer;
  margin-top:30px;
  font-size:20px;
  border:none;
  background-color:#00adb5;
  color:#eeeeee;
`;