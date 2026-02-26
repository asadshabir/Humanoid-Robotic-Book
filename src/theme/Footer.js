import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import Link from '@docusaurus/Link';
import RobotIcon, { RoboticIcons } from '../Icon/RobotIcon';

const Footer = (props) => {
  return (
    <>
      <OriginalFooter {...props} />
      <div className="footer-robot-container">
        <RobotIcon
          icon={RoboticIcons.robot}
          size="1.8em"
          className="footer-robot-icon animated float"
        />
      </div>
    </>
  );
};

export default Footer;