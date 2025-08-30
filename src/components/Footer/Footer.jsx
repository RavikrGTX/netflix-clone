import React from "react";
import "./Footer.css";
import youtube_icon from "../../assets/youtube_icon.png";
import twitter_icon from "../../assets/twitter_icon.png";
import instagram_icon from "../../assets/instagram_icon.png";
import facebook_icon from "../../assets/facebook_icon.png";
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-icons">
        <img src={youtube_icon} alt="youtube-icon" />
        <img src={twitter_icon} alt="twitter-icon" />
        <img src={instagram_icon} alt="instagram-icon" />
        <img src={facebook_icon} alt="facebook-icon" />
      </div>
      <ul>
        <li>Audio Desciption</li>
        <li>Help Center</li>
        <li>Gift Cards</li>
        <li>Media Center</li>
        <li>Investor Relations</li>
        <li>Jobs</li>
        <li>Terms of Use</li>
        <li>Privacy</li>
        <li>legal Notices</li>
        <li>Corporate Information</li>
        <li>Contact Us</li>
      </ul>
      <p className="copyright-text">© 2024 Netflix, Inc. All rights reserved.
</p>
    </div>
  );
};

export default Footer;
