import React from 'react';
import {
  FooterText,
  Link,
  AppFooter
} from './styledComponents/appComponents';
const Footer = () => {

    return(
        <AppFooter>
          <FooterText tabIndex={0}>Built by <Link href="https://alexstrand.dev">Alex</Link></FooterText>
        </AppFooter>
    )
}

export default Footer;