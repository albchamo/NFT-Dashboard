// src/app/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';  // For Next.js 13 use next/navigation
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page
    router.push('/dashboard');
  }, [router]);

  return null;  // Since we're redirecting, no need to render anything
};

export default HomePage;
