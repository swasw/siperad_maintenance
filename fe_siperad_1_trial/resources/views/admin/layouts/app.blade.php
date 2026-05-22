<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100">
            @include('layouts.navigation')

            <!-- Page Heading -->
            @isset($header)
                <header class="bg-white shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endisset

            <!-- Page Content -->
            <main>
                {{ $slot }}
            </main>
        </div>

        <style>
            #notification-blocker {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 1000; /* Lower than alert modals */
                flex-direction: column;
                text-align: center;
            }

            #notification-blocker h2 {
                color: #fff;
                margin-bottom: 20px;
                font-size: 2rem;
            }

            #notification-blocker p {
                margin-bottom: 30px;
                font-size: 1.1rem;
            }

            #enable-notifications-btn {
                padding: 12px 24px;
                font-size: 16px;
                background: #0d6efd;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s;
            }

            #enable-notifications-btn:hover {
                background: #0b5ed7;
            }
        </style>

        <div id="notification-blocker">
            <h2>Action Required</h2>
            <p>You must enable browser notifications to use this website.</p>
            <button id="enable-notifications-btn">Enable Notifications</button>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #ccc;">
                Note: If clicking the button does nothing, your browser has blocked prompts.<br>
                Please click the site information icon (🔒 or 🎛️) next to the URL bar to allow notifications manually.
            </p>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const blocker = document.getElementById('notification-blocker');
                const btn = document.getElementById('enable-notifications-btn');

                function checkPermission() {
                    if (Notification.permission === 'granted') {
                        blocker.style.display = 'none';
                        document.body.style.overflow = 'auto'; // restore scrolling
                    } else {
                        blocker.style.display = 'flex';
                        document.body.style.overflow = 'hidden'; // prevent background scrolling
                    }
                }

                if (!('Notification' in window)) {
                    blocker.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    btn.style.display = 'none';
                    alert("This browser does not support desktop notifications. You cannot use this site.");
                } else {
                    checkPermission();
                    
                    btn.addEventListener('click', function () {
                        Notification.requestPermission().then(function (permission) {
                            checkPermission();
                            if (permission !== 'granted') {
                                alert('You must allow notifications! Check your browser URL bar if it\'s blocked.');
                            } else {
                                // Notification granted
                            }
                        });
                    });
                }
            });
        </script>
    </body>
</html>
