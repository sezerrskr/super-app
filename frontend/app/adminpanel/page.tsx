"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar/navbar';
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
    const { isAuthenticated, username, logout } = useAuth();

    return (
        <div className="bg-gray-900 w-full min-h-screen text-gray-100 overflow-x-hidden">
            <div className="p-6 text-center">
                {isAuthenticated ? (
                    <>
                        <h1>Kullanıcı Sayısı: </h1>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">Merhablar bu güzel özellikleri kullanmak için giriş yapmalısınız.</h1>
                        <p className="text-gray-400 mt-2">
                            Lütfen giriş sayfasına giderek oturum aç.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};
