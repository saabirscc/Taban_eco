// lib/screens/forgot_password_email_screen.dart

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import '../services/auth_service.dart';
import 'otp_verification_screen.dart'; // your reusable OTP screen
import 'reset_password_screen.dart';

class ForgotPasswordEmailScreen extends StatefulWidget {
  const ForgotPasswordEmailScreen({Key? key}) : super(key: key);

  @override
  State<ForgotPasswordEmailScreen> createState() => _ForgotPasswordEmailScreenState();
}

class _ForgotPasswordEmailScreenState extends State<ForgotPasswordEmailScreen> {
  final _formKey = GlobalKey<FormState>();
  String email = '';
  bool isLoading = false;
  static const Color mainColor = Color(0xFF3CAC44);

  Future<void> _submitEmail() async {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() => isLoading = true);
    try {
      // Step 1: request OTP
      await AuthService.forgotPasswordRequestOtpPos(email.trim());
      Fluttertoast.showToast(
        msg: 'If that email exists, OTP has been sent.',
        backgroundColor: mainColor,
        textColor: Colors.white,
      );
      if (!mounted) return;
      // Navigate to OTP screen
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => OtpVerificationScreen(
            email: email.trim(),
            title: 'Verify OTP',
            description:  'Enter the 6-digit code sent to your email to reset your password.',
            mainColor: mainColor,
                 otpLength: 6, 
            onVerify: (otp) async {
              // Step 2: verify OTP
              await AuthService.verifyForgotOtpPos(email.trim(), otp);
              // On success, navigate to ResetPasswordScreen
              if (!mounted) return;
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => ResetPasswordScreen(email: email.trim(), otp: otp),
                ),
              );
            },
            onResend: () async {
              // Resend OTP:
              await AuthService.forgotPasswordRequestOtpPos(email.trim());
              Fluttertoast.showToast(
                msg: 'OTP resent to $email',
                backgroundColor: mainColor,
                textColor: Colors.white,
              );
            },
          ),
        ),
      );
    } catch (e) {
      Fluttertoast.showToast(
        msg: e.toString(),
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  OutlineInputBorder _inputBorder(Color color) => OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: color),
      );

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: theme.colorScheme.onSurface),
        title: Text(
          'Forgot Password',
          style: theme.textTheme.titleLarge?.copyWith(color: theme.colorScheme.onSurface),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Text(
                'Enter your email and we’ll send you a 4-digit code to reset your password.',
                style: theme.textTheme.bodyMedium
                    ?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email_outlined, color: mainColor),
                  labelStyle: TextStyle(color: mainColor),
                  enabledBorder: _inputBorder(mainColor),
                  focusedBorder: _inputBorder(mainColor),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Enter your email';
                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(val)) {
                    return 'Enter a valid email';
                  }
                  return null;
                },
                onChanged: (val) => email = val.trim(),
                enabled: !isLoading,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isLoading ? null : _submitEmail,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: mainColor,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Send Reset Code'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
