import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center">
      <img 
        src="https://cdn.shopify.com/s/files/1/0629/0898/9620/files/test.png?v=1711403286" 
        alt="Pluto" 
        className="h-12 w-auto object-contain" 
        style={{
          filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );
};

export default Logo;