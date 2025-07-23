// lib/screens/register_screen.dart
//
// Full copy‑paste‑ready file
// -----------------------------------------------------------
// • District field renamed **“Street / Road”** and now has a
//   📍 button that auto‑detects the user’s street (same logic as
//   ProfileTab & MapScreen).
// • Uses on‑device geocoder only; no web calls.
// -----------------------------------------------------------

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

import '../services/auth_service.dart';
import '../providers/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen>
    with SingleTickerProviderStateMixin {
  /* ───────── controllers / state ───────── */
  final _formKey = GlobalKey<FormState>();

  final _fullNameFocusNode = FocusNode();
  final _emailFocusNode    = FocusNode();
  final _passwordFocusNode = FocusNode();
  final _districtFocusNode = FocusNode();
  final _phoneFocusNode    = FocusNode();

  final _districtC = TextEditingController();

  String fullName   = '';
  String email      = '';
  String password   = '';
  String district   = '';
  String phoneNumber= '';
  bool   isLoading  = false;
  bool   _obscurePassword = true;

  late final AnimationController _controller;
  late final Animation<double> _opacityAnimation;
  late final Animation<double> _translateAnimation;

  static const Color mainColor = Color(0xFF3CAC44);

  /* ───────── lifecycle ───────── */
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _opacityAnimation   = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
    _translateAnimation = Tween<double>(begin: 40, end: 0).animate(_opacityAnimation);
    _controller.forward();

    WidgetsBinding.instance.addPostFrameCallback((_) => _fullNameFocusNode.requestFocus());
  }

  @override
  void dispose() {
    _controller.dispose();
    _fullNameFocusNode.dispose();
    _emailFocusNode.dispose();
    _passwordFocusNode.dispose();
    _districtFocusNode.dispose();
    _phoneFocusNode.dispose();
    _districtC.dispose();
    super.dispose();
  }

  /* ───────── GPS → street helper ───────── */
  Future<void> _detectStreet() async {
    if (!await Geolocator.isLocationServiceEnabled()) {
      Fluttertoast.showToast(msg: 'Please enable location services');
      return;
    }
    LocationPermission perm = await Geolocator.checkPermission();
    if (perm == LocationPermission.denied) perm = await Geolocator.requestPermission();
    if (perm == LocationPermission.denied ||
        perm == LocationPermission.deniedForever) {
      Fluttertoast.showToast(msg: 'Location permission denied');
      return;
    }

    try {
      final pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 10),
      );

      final placemarks = await placemarkFromCoordinates(
        pos.latitude,
        pos.longitude,
      );

      String street = 'Unknown';
      if (placemarks.isNotEmpty) {
        final p   = placemarks.first;
        final num = (p.subThoroughfare ?? '').trim();
        final rd  = (p.thoroughfare     ?? '').trim();
        street    = [num, rd].where((s) => s.isNotEmpty).join(' ').trim();
        if (street.isEmpty) street = p.street ?? p.name ?? 'Unknown';
      }

      setState(() {
        _districtC.text = street;
        district        = street;
      });
    } catch (e) {
      Fluttertoast.showToast(msg: 'Failed to resolve location');
    }
  }

  /* ───────── register flow ───────── */
  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() => isLoading = true);

    final fName  = fullName.trim();
    final eMail  = email.trim();
    final pwd    = password;
    final dist   = district.trim();
    final phone  = phoneNumber.trim();

    try {
      await AuthService.registerSendOtpPos(fName, eMail, pwd, dist, phone);

      Fluttertoast.showToast(
        msg: "OTP sent to $eMail. Please check your email.",
        backgroundColor: mainColor,
        textColor: Colors.white,
      );

      if (!mounted) return;
      context.push('/otp', extra: {
        'email'     : eMail,
        'fullName'  : fName,
        'password'  : pwd,
        'district'  : dist,
        'phone'     : phone,
        'otpLength' : 6,
      });
    } catch (e) {
      Fluttertoast.showToast(
        msg: e.toString(),
        backgroundColor: Colors.red[700],
        textColor: Colors.white,
      );
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  OutlineInputBorder _inputBorder(Color c) => OutlineInputBorder(
    borderRadius: BorderRadius.circular(8),
    borderSide: BorderSide(color: c),
  );

  /* ───────── UI ───────── */
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final size  = MediaQuery.of(context).size;

    return AnimatedBuilder(
      animation: _controller,
      builder: (_, __) => Scaffold(
        backgroundColor: theme.colorScheme.surface,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                // header
                FadeTransition(
                  opacity: _opacityAnimation,
                  child: Transform.translate(
                    offset: Offset(0, _translateAnimation.value),
                    child: Column(
                      children: [
                        const SizedBox(height: 30),
                        Image.asset('assets/images/eco_logo.png',
                            height: size.height * 0.12),
                        const SizedBox(height: 20),
                        Text('Create Account',
                            style: theme.textTheme.headlineMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: mainColor,
                            )),
                        const SizedBox(height: 8),
                        Text('Join our eco-volunteer community',
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: theme.colorScheme.onSurface.withOpacity(.7),
                            )),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 30),

                // form card
                FadeTransition(
                  opacity: _opacityAnimation,
                  child: Transform.translate(
                    offset: Offset(0, _translateAnimation.value * .5),
                    child: Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              _textField(
                                focus: _fullNameFocusNode,
                                label: 'Full Name',
                                icon: Icons.person_outline,
                                next: _emailFocusNode,
                                onChanged: (v) => fullName = v.trim(),
                                validator: (v) =>
                                    v == null || v.isEmpty
                                        ? 'Please enter your full name'
                                        : v.length < 3
                                            ? 'Name too short'
                                            : null,
                              ),
                              const SizedBox(height: 16),
                              _textField(
                                focus: _emailFocusNode,
                                label: 'Email',
                                icon: Icons.email_outlined,
                                type: TextInputType.emailAddress,
                                next: _passwordFocusNode,
                                onChanged: (v) => email = v.trim(),
                                validator: (v) {
                                  if (v == null || v.isEmpty) return 'Enter email';
                                  final exp = RegExp(r'^[\w-.]+@([\w-]+\.)+\w{2,4}$');
                                  return exp.hasMatch(v) ? null : 'Invalid email';
                                },
                              ),
                              const SizedBox(height: 16),
                              _textField(
                                focus: _passwordFocusNode,
                                label: 'Password',
                                icon: Icons.lock_outlined,
                                next: _districtFocusNode,
                                obscure: _obscurePassword,
                                suffix: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: mainColor,
                                  ),
                                  onPressed: () =>
                                      setState(() => _obscurePassword = !_obscurePassword),
                                ),
                                onChanged: (v) => password = v.trim(),
                                validator: (v) =>
                                    v == null || v.isEmpty
                                        ? 'Enter password'
                                        : v.length < 6
                                            ? 'Min 6 characters'
                                            : null,
                              ),
                              const SizedBox(height: 16),
                              _textField(
                                focus: _districtFocusNode,
                                label: 'Street / Road',
                                icon: Icons.location_on_outlined,
                                controller: _districtC,
                                next: _phoneFocusNode,
                                onChanged: (v) => district = v.trim(),
                                suffix: IconButton(
                                  icon: const Icon(Icons.my_location, color: mainColor),
                                  onPressed: _detectStreet,
                                ),
                                validator: (v) =>
                                    v == null || v.isEmpty ? 'Enter street' : null,
                              ),
                              const SizedBox(height: 16),
                              _textField(
                                focus: _phoneFocusNode,
                                label: 'Phone Number',
                                icon: Icons.phone_outlined,
                                type: TextInputType.phone,
                                inputFormatters: [
                                  FilteringTextInputFormatter.digitsOnly,
                                ],
                                onChanged: (v) => phoneNumber = v.trim(),
                                validator: (v) =>
                                    v == null || v.isEmpty
                                        ? 'Enter phone number'
                                        : v.length < 10
                                            ? 'Invalid phone'
                                            : null,
                                onSubmit: (_) => _register(),
                              ),
                              const SizedBox(height: 24),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: isLoading ? null : _register,
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
                                      : const Text('REGISTER'),
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

                // login link
                FadeTransition(
                  opacity: _opacityAnimation,
                  child: Transform.translate(
                    offset: Offset(0, _translateAnimation.value * .3),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Already have an account? ',
                            style:
                                theme.textTheme.bodyMedium?.copyWith(color: mainColor)),
                        TextButton(
                          onPressed: isLoading ? null : () => context.go('/login'),
                          child: Text('Login',
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
      ),
    );
  }

  /* helper builder for text fields */
  Widget _textField({
    required FocusNode focus,
    required String label,
    required IconData icon,
    TextInputType type = TextInputType.text,
    FocusNode? next,
    bool obscure = false,
    Widget? suffix,
    List<TextInputFormatter>? inputFormatters,
    String? Function(String?)? validator,
    void Function(String)? onChanged,
    void Function(String)? onSubmit,
    TextEditingController? controller,
  }) =>
      TextFormField(
        controller: controller,
        focusNode: focus,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, color: mainColor),
          enabledBorder: _inputBorder(mainColor),
          focusedBorder: _inputBorder(mainColor),
          suffixIcon: suffix,
          labelStyle: const TextStyle(color: mainColor),
        ),
        keyboardType: type,
        textInputAction: next != null ? TextInputAction.next : TextInputAction.done,
        obscureText: obscure,
        inputFormatters: inputFormatters,
        validator: validator,
        onChanged: onChanged,
        onFieldSubmitted: (val) {
          if (next != null) next.requestFocus();
          onSubmit?.call(val);
        },
        cursorColor: mainColor,
        style: const TextStyle(color: mainColor),
      );
}
