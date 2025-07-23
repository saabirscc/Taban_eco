import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';           // ← NEW

import '../providers/auth_provider.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailFocusNode = FocusNode();
  final _passwordFocusNode = FocusNode();

  String email = '';
  String password = '';
  bool isLoading = false;
  bool _obscurePassword = true;
  late final AnimationController _controller;
  late final Animation<double> _opacityAnimation;
  late final Animation<double> _translateAnimation;

  static const Color mainColor = Color(0xFF3CAC44);

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _opacityAnimation =
        CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
    _translateAnimation =
        Tween<double>(begin: 30, end: 0).animate(_opacityAnimation);
    _controller.forward();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _emailFocusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _emailFocusNode.dispose();
    _passwordFocusNode.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() => isLoading = true);

    try {
      // ← HERE: go through AuthProvider so token + user are both saved
      await Provider.of<AuthProvider>(context, listen: false)
          .login(email, password);

      Fluttertoast.showToast(
        msg: 'Login successful',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: mainColor,
        textColor: Colors.white,
      );

      await Future.delayed(const Duration(milliseconds: 500));
      if (!mounted) return;

      /// REPLACED Navigator with GoRouter ➜ send to dashboard
      context.go('/dashboard');
    } catch (e) {
      Fluttertoast.showToast(
        msg: e.toString(),
        toastLength: Toast.LENGTH_LONG,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.red[700],
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
    final size = MediaQuery.of(context).size;

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: theme.colorScheme.surface,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  /* ───── Logo & title ───── */
                  FadeTransition(
                    opacity: _opacityAnimation,
                    child: Transform.translate(
                      offset: Offset(0, _translateAnimation.value),
                      child: Column(
                        children: [
                          const SizedBox(height: 40),
                          Image.asset('assets/images/eco_logo.png',
                              height: size.height * 0.15),
                          const SizedBox(height: 24),
                          Text(
                            'Welcome Back',
                            style: theme.textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.bold, color: mainColor),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Sign in to continue your eco journey',
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: theme.colorScheme.onSurface
                                  .withOpacity(0.7),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),

                  /* ───── Form card ───── */
                  FadeTransition(
                    opacity: _opacityAnimation,
                    child: Transform.translate(
                      offset: Offset(0, _translateAnimation.value * 0.5),
                      child: Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Form(
                            key: _formKey,
                            child: Column(
                              children: [
                                /* Email */
                                TextFormField(
                                  focusNode: _emailFocusNode,
                                  decoration: InputDecoration(
                                    labelText: 'Email',
                                    prefixIcon: const Icon(
                                        Icons.email_outlined, color: mainColor),
                                    labelStyle: const TextStyle(
                                        color: mainColor),
                                    enabledBorder: _inputBorder(mainColor),
                                    focusedBorder: _inputBorder(mainColor),
                                  ),
                                  keyboardType: TextInputType.emailAddress,
                                  textInputAction: TextInputAction.next,
                                  onFieldSubmitted: (_) {
                                    _emailFocusNode.unfocus();
                                    _passwordFocusNode.requestFocus();
                                  },
                                  validator: (val) {
                                    if (val == null || val.isEmpty) {
                                      return 'Please enter your email';
                                    }
                                    if (!RegExp(r'^[\w-.]+@([\w-]+\.)+\w{2,4}$')
                                        .hasMatch(val)) {
                                      return 'Please enter a valid email';
                                    }
                                    return null;
                                  },
                                  onChanged: (val) => email = val.trim(),
                                  cursorColor: mainColor,
                                  style: const TextStyle(color: mainColor),
                                ),
                                const SizedBox(height: 16),

                                /* Password */
                                TextFormField(
                                  focusNode: _passwordFocusNode,
                                  decoration: InputDecoration(
                                    labelText: 'Password',
                                    prefixIcon: const Icon(
                                        Icons.lock_outlined, color: mainColor),
                                    labelStyle: const TextStyle(
                                        color: mainColor),
                                    enabledBorder: _inputBorder(mainColor),
                                    focusedBorder: _inputBorder(mainColor),
                                    suffixIcon: IconButton(
                                      icon: Icon(
                                        _obscurePassword
                                            ? Icons.visibility_off_outlined
                                            : Icons.visibility_outlined,
                                        color: mainColor,
                                      ),
                                      onPressed: () => setState(() =>
                                          _obscurePassword = !_obscurePassword),
                                    ),
                                  ),
                                  obscureText: _obscurePassword,
                                  textInputAction: TextInputAction.done,
                                  onFieldSubmitted: (_) => _login(),
                                  validator: (val) {
                                    if (val == null || val.isEmpty) {
                                      return 'Please enter your password';
                                    }
                                    if (val.length < 6) {
                                      return 'Password must be at least 6 characters';
                                    }
                                    return null;
                                  },
                                  onChanged: (val) => password = val.trim(),
                                  cursorColor: mainColor,
                                  style: const TextStyle(color: mainColor),
                                ),
                                const SizedBox(height: 8),

                                /* Forgot password */
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: TextButton(
                                    onPressed: isLoading
                                        ? null
                                        : () => context.push('/forgot-email'),
                                    child: Text('Forgot Password?',
                                        style: theme.textTheme.bodyMedium
                                            ?.copyWith(color: mainColor)),
                                  ),
                                ),
                                const SizedBox(height: 16),

                                /* Login button */
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: isLoading ? null : _login,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: mainColor,
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 16),
                                      shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(8),
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
                                        : Text(
                                            'LOGIN',
                                            style: theme.textTheme.labelLarge
                                                ?.copyWith(
                                              color: Colors.white,
                                              letterSpacing: 1.2,
                                            ),
                                          ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  /* ───── Register link ───── */
                  FadeTransition(
                    opacity: _opacityAnimation,
                    child: Transform.translate(
                      offset: Offset(0, _translateAnimation.value * 0.3),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text("Don't have an account? ",
                              style: theme.textTheme.bodyMedium
                                  ?.copyWith(color: mainColor)),
                          TextButton(
                            onPressed:
                                isLoading ? null : () => context.go('/register'),
                            child: Text('Register',
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  color: mainColor,
                                  fontWeight: FontWeight.bold,
                                )),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
