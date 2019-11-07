import YouTube from 'react-youtube';
import styled from "styled-components";
export const Grid = styled.div`
  padding:15px;
  display:grid;
  grid-template-rows: 1fr 1fr auto auto;
  @media screen and (min-width:500px) {
    grid-template-rows: 1fr 1fr auto auto;
  }
`;
//grid-template-rows: 250px 1fr 1fr;

export const Cell = styled.div `
display:${props => props.flex ? props.flex : null};
flex-direction:${props => props.flexDirection ? props.flexDirection : null};
align-items:${props => props.alignItems ? props.alignItems : null};
justify-content:${props => props.justifyValue ? props.justifyValue : null};
`;
export const VideoWrapper = styled(Cell)`
    overflow: hidden;
    position: relative;
    padding-top:25px;
    padding-bottom:56.25%;
    height: 0px;
    min-width: 320px;
    max-width: 1200px;
    flex-basis: auto; /* default value */
    flex-grow: 1;
    margin: 0 auto;
`;
export const ResponsiveIframe = styled(YouTube)`
    position: absolute;
	  top: 0;
    left: 0;
    width: 100%;
	  height: 100%;
`;

export const Text = styled.p`
    text-align:center;
    color:#eeeeee;
    margin-top:15px;
`;

export const FooterText = styled(Text) `
  position:fixed;
  bottom: 0;
`;

export const AppFooter = styled.footer `
  flex-direction:column;
  align-items:center;
  justify-content:center;
  display:flex;
`;

export const Link = styled.a `
  color:#eeeeee;
`;

export const StyledButton = styled.button`
  padding:15px;
  cursor:pointer;
  margin-top:30px;
  font-size:20px;
  border:none;
  background-color:#ca3e47;
  color:#ffffff;
`;