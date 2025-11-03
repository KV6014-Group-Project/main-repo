import { ScrollViewStyleReset } from 'expo-router/html';
import React, { type PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Inline script to set theme before hydration to avoid flash-of-incorrect-theme */}
        <script
          // Runs before React hydrates; keep tiny and defensive
          // Checks for stored theme preference and applies it immediately
          dangerouslySetInnerHTML={{
            __html: `;(function(){try{var keys=['nativewind-color-scheme','theme','color-scheme','preferred-color-scheme'];var v=null;for(var i=0;i<keys.length;i++){v=localStorage.getItem(keys[i]);if(v)break;}if(v==='dark'){document.documentElement.classList.add('dark');return;}if(v==='light'){document.documentElement.classList.remove('dark');return;}if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}}catch(e){}})()`
          }}
        />

        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
