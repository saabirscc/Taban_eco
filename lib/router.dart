import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:vol/providers/auth_provider.dart';
import 'package:vol/services/auth_service.dart';          // ← ADD THIS

// Public screens
import 'package:vol/screens/splash_screen.dart';
import 'package:vol/screens/onboarding_screen.dart';
import 'package:vol/screens/login_screen.dart';
import 'package:vol/screens/register_screen.dart';
import 'package:vol/screens/forgot_password_email_screen.dart';
import 'package:vol/screens/reset_password_screen.dart';
import 'package:vol/screens/ResetPasswordSuccessScreen.dart';
import 'package:vol/screens/otp_verification_screen.dart';

// App screens
import 'package:vol/screens/home_screen.dart';
import 'package:vol/screens/dashboard_screen.dart';

bool _isAuthed(BuildContext ctx) =>
    Provider.of<AuthProvider>(ctx, listen: false).isAuthenticated;

final GoRouter appRouter = GoRouter(
  initialLocation: '/splash',
  redirect: (BuildContext ctx, GoRouterState state) {
    final loc = state.uri.path;
    final authed = _isAuthed(ctx);

    const publicPaths = {
      '/splash',
      '/onboarding',
      '/login',
      '/register',
      '/otp',
      '/forgot-email',
      '/reset-success',
      '/reset',
    };

    if (loc == '/' || loc == '/splash') return '/splash';

    if (!authed && !publicPaths.contains(loc)) return '/login';

    if (authed && publicPaths.contains(loc)) return '/dashboard';

    return null;
  },
  routes: [
    // Public
    GoRoute(path: '/splash',        builder: (_, __) => const SplashScreen()),
    GoRoute(path: '/onboarding',    builder: (_, __) => const OnboardingScreen()),
    GoRoute(path: '/login',         builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register',      builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/forgot-email',  builder: (_, __) => const ForgotPasswordEmailScreen()),
    GoRoute(path: '/reset-success', builder: (_, __) => const ResetPasswordSuccessScreen()),
    GoRoute(
      path: '/reset',
      builder: (ctx, state) {
        final extra = (state.extra ?? {}) as Map<String, String>;
        return ResetPasswordScreen(
          email: extra['email'] ?? '',
          otp:   extra['otp']   ?? '',
        );
      },
    ),
    GoRoute(
      path: '/otp',
      builder: (ctx, state) {
        final extra = (state.extra ?? {}) as Map<String, dynamic>;
        final email     = extra['email']     as String? ?? '';
        final fullName  = extra['fullName']  as String? ?? '';
        final password  = extra['password']  as String? ?? '';
        final district  = extra['district']  as String? ?? '';
        final phone     = extra['phone']     as String? ?? '';
        final otpLength = extra['otpLength'] as int?    ?? 6;

        return OtpVerificationScreen(
          email: email,
          otpLength: otpLength,
          onVerify: (code) async {
            // 1) verify on backend
            await AuthService.verifyRegisterOtp(email: email, otp: code);
            // 2) login via provider (this persists token+user)
            await ctx.read<AuthProvider>().login(email, password);
            // 3) go to dashboard
            if (ctx.mounted) ctx.go('/dashboard');
          },
          onResend: () async {
            await AuthService.registerSendOtp(
              fullName:    fullName,
              email:       email,
              password:    password,
              district:    district,
              phoneNumber: phone,
            );
          },
        );
      },
    ),

    // Protected
    GoRoute(path: '/home',      builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
  ],
  errorBuilder: (_, __) => const Scaffold(
    body: Center(child: Text('Page not found')),
  ),
);
