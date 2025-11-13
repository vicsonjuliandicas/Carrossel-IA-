
import React from 'react';

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.016 3.657 9.155 8.441 9.876V14.82h-2.91v-2.825h2.91v-2.12c0-2.872 1.756-4.437 4.312-4.437 1.229 0 2.285.091 2.593.132v2.44h-1.442c-1.419 0-1.693.676-1.693 1.666v2.199h3.047l-.497 2.825h-2.55V21.876C18.343 21.155 22 17.016 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default FacebookIcon;
