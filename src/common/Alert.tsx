import React from 'react';

const Alert: React.FC<{ heading: string }> = ({ heading, children }) => (
  <div className="bg-success-background border border-success-foreground rounded p-3 text-success-foreground">
    <div className="text-xl">{heading}</div>
    <hr className="border-success-foreground mt-2" />
    <p className="mt-2">{children}</p>
  </div>
);

export default Alert;
