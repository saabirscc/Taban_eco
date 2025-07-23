import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';   // ← use GoRouter, not Navigator

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    // Wait 3 seconds, then jump to the login route.
    Timer(const Duration(seconds: 3), () {
      if (mounted) context.go('/login');      // <-- path must match router
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox.expand(
        child: Image.asset(
          'assets/images/1.png',
          fit: BoxFit.cover,
          alignment: Alignment.center,
        ),
      ),
    );
  }
}
 