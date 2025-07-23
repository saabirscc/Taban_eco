import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';          // ← NEW
import '../services/auth_service.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String email;
  final String otp;   // passed from the OTP-verification screen

  const ResetPasswordScreen({
    Key? key,
    required this.email,
    required this.otp,
  }) : super(key: key);

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _formKey = GlobalKey<FormState>();

  String newPassword = '';
  String confirmPassword = '';
  bool isLoading = false;
  bool _obscureNew = true;
  bool _obscureConfirm = true;

  static const Color mainColor = Color(0xFF3CAC44);

  Future<void> _submitReset() async {
    if (!_formKey.currentState!.validate()) return;
    if (newPassword != confirmPassword) {
      Fluttertoast.showToast(
        msg: 'Passwords do not match',
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
      return;
    }

    FocusScope.of(context).unfocus();
    setState(() => isLoading = true);

    try {
      await AuthService.resetPasswordWithOtpPos(
        widget.email,
        widget.otp,
        newPassword.trim(),
      );

      Fluttertoast.showToast(
        msg: 'Password reset successful. Please log in with your new password.',
        backgroundColor: mainColor,
        textColor: Colors.white,
      );

      await Future.delayed(const Duration(seconds: 2));
      if (!mounted) return;

      /* USE GoRouter — no Navigator assertions */
      context.go('/reset-success');          // path exists in router.dart
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

  OutlineInputBorder _border(Color c) =>
      OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: c));

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: theme.colorScheme.onSurface),
        title: Text('Reset password',
            style: theme.textTheme.titleLarge
                ?.copyWith(color: theme.colorScheme.onSurface)),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Text(
                'Enter a new password and confirm to reset.',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(.7),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),

              /* New password */
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'New password',
                  prefixIcon:
                      const Icon(Icons.lock_outline, color: mainColor),
                  labelStyle: const TextStyle(color: mainColor),
                  enabledBorder: _border(mainColor),
                  focusedBorder: _border(mainColor),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscureNew
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: mainColor,
                    ),
                    onPressed: () => setState(() => _obscureNew = !_obscureNew),
                  ),
                ),
                obscureText: _obscureNew,
                validator: (v) => v == null || v.isEmpty
                    ? 'Enter new password'
                    : v.length < 6
                        ? 'At least 6 characters'
                        : null,
                onChanged: (v) => newPassword = v,
                enabled: !isLoading,
                cursorColor: mainColor,
                style: const TextStyle(color: mainColor),
              ),
              const SizedBox(height: 16),

              /* Confirm password */
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Confirm password',
                  prefixIcon:
                      const Icon(Icons.lock_outline, color: mainColor),
                  labelStyle: const TextStyle(color: mainColor),
                  enabledBorder: _border(mainColor),
                  focusedBorder: _border(mainColor),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscureConfirm
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: mainColor,
                    ),
                    onPressed: () =>
                        setState(() => _obscureConfirm = !_obscureConfirm),
                  ),
                ),
                obscureText: _obscureConfirm,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Confirm your password' : null,
                onChanged: (v) => confirmPassword = v,
                enabled: !isLoading,
                cursorColor: mainColor,
                style: const TextStyle(color: mainColor),
              ),
              const SizedBox(height: 24),

              /* submit button */
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isLoading ? null : _submitReset,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: mainColor,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: isLoading
                      ? const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Reset password'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
