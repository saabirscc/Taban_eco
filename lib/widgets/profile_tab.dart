// lib/views/profile_tab.dart
//
// Street auto‑detect + proper logout redirection
// ----------------------------------------------

import 'dart:io';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:go_router/go_router.dart';        // ← NEW

import '../providers/auth_provider.dart';
import '../services/auth_service.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _fullNameC;
  late final TextEditingController _emailC;
  late final TextEditingController _streetC;
  late final TextEditingController _phoneC;

  bool  _isEditing = false;
  bool  _isSaving  = false;
  File? _pickedImage;

  @override
  void initState() {
    super.initState();
    final u = context.read<AuthProvider>().user!;
    _fullNameC = TextEditingController(text: u.fullName);
    _emailC    = TextEditingController(text: u.email);
    _streetC   = TextEditingController(text: u.district);
    _phoneC    = TextEditingController(text: u.phone ?? '');
  }

  @override
  void dispose() {
    _fullNameC.dispose();
    _emailC.dispose();
    _streetC.dispose();
    _phoneC.dispose();
    super.dispose();
  }

  /* ───────── helpers ───────── */

  Future<void> _pickImage() async {
    if (kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Image picking not supported on web')),
      );
      return;
    }
    final XFile? file =
        await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 70);
    if (file != null) setState(() => _pickedImage = File(file.path));
  }

  Future<void> _detectStreet() async {
    if (kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Auto‑location not supported on web')),
      );
      return;
    }
    if (!await Geolocator.isLocationServiceEnabled()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enable location services')),
      );
      return;
    }
    LocationPermission perm = await Geolocator.checkPermission();
    if (perm == LocationPermission.denied) perm = await Geolocator.requestPermission();
    if (perm == LocationPermission.denied ||
        perm == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location permission denied')),
      );
      return;
    }

    try {
      final pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 10),
      );

      final placemarks =
          await placemarkFromCoordinates(pos.latitude, pos.longitude);

      String street = 'Unknown';
      if (placemarks.isNotEmpty) {
        final p   = placemarks.first;
        final num = (p.subThoroughfare ?? '').trim();   // e.g. “25”
        final rd  = (p.thoroughfare     ?? '').trim();   // e.g. “Shaqaalaha Rd”
        street    = [num, rd].where((s) => s.isNotEmpty).join(' ').trim();
        if (street.isEmpty) street = p.street ?? p.name ?? 'Unknown';
      }

      if (mounted) _streetC.text = street;
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to resolve location')),
        );
      }
    }
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);

    try {
      final street = _streetC.text.trim().isEmpty ? 'Unknown' : _streetC.text.trim();

      String? uploadedUrl;
      if (!kIsWeb && _pickedImage != null) {
        uploadedUrl = await AuthService.uploadProfilePicture(_pickedImage!);
      }

      final updated = await AuthService.updateProfile(
        fullName:       _fullNameC.text.trim(),
        email:          _emailC.text.trim(),
        district:       street,
        phoneNumber:    _phoneC.text.trim(),
        profilePicture: uploadedUrl,
      );

      context.read<AuthProvider>().setUser(updated);

      setState(() {
        _isSaving  = false;
        _isEditing = false;
        _pickedImage = null;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated!')),
        );
      }
    } catch (e) {
      setState(() => _isSaving = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update profile: $e')),
        );
      }
    }
  }

  OutlineInputBorder _border(Color c) => OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: c),
      );

  Widget _field({
    required TextEditingController c,
    required String label,
    bool enabled = true,
    TextInputType type = TextInputType.text,
    String? Function(String?)? validator,
    Widget? suffix,
  }) =>
      TextFormField(
        controller: c,
        enabled: enabled,
        keyboardType: type,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Color(0xFF3CAC44)),
          enabledBorder: _border(const Color(0xFF3CAC44)),
          focusedBorder: _border(const Color(0xFF3CAC44)),
          suffixIcon: suffix,
        ),
        validator: validator,
      );

  /* ───────── build ───────── */
  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    if (user == null) return const SizedBox.shrink();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            // Avatar
            Stack(
              children: [
                CircleAvatar(
                  radius: 55,
                  backgroundColor: const Color(0xFF3CAC44),
                  child: CircleAvatar(
                    radius: 50,
                    backgroundImage: _pickedImage != null
                        ? FileImage(_pickedImage!)
                        : (user.profilePicture != null
                                ? NetworkImage(user.profilePicture!)
                                : null) as ImageProvider?,
                    child: (_pickedImage == null && user.profilePicture == null)
                        ? Text(
                            user.fullName.isNotEmpty
                                ? user.fullName[0].toUpperCase()
                                : '?',
                            style: const TextStyle(fontSize: 40, color: Colors.white),
                          )
                        : null,
                  ),
                ).animate().shake(delay: 300.ms),
                if (_isEditing)
                  Positioned(
                    right: 4,
                    bottom: 0,
                    child: InkWell(
                      onTap: _pickImage,
                      child: const CircleAvatar(
                        radius: 18,
                        backgroundColor: Color(0xFF3CAC44),
                        child: Icon(Icons.camera_alt, color: Colors.white),
                      ).animate().scale(delay: 200.ms),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 20),

            // Fields
            _field(
              c: _fullNameC,
              label: 'Full Name',
              enabled: _isEditing,
              validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null,
            ).animate().fadeIn(delay: 100.ms).slideX(begin: .1),
            const SizedBox(height: 15),
            _field(
              c: _emailC,
              label: 'Email',
              enabled: _isEditing,
              type: TextInputType.emailAddress,
              validator: (v) => v == null || !RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(v)
                  ? 'Invalid email'
                  : null,
            ).animate().fadeIn(delay: 200.ms).slideX(begin: .1),
            const SizedBox(height: 15),
            _field(
              c: _streetC,
              label: 'Street / Road',
              enabled: _isEditing,
              validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null,
              suffix: _isEditing
                  ? IconButton(
                      icon: const Icon(Icons.my_location, color: Color(0xFF3CAC44)),
                      onPressed: _detectStreet,
                    )
                  : null,
            ).animate().fadeIn(delay: 300.ms).slideX(begin: .1),
            const SizedBox(height: 15),
            _field(
              c: _phoneC,
              label: 'Phone Number',
              enabled: _isEditing,
              type: TextInputType.phone,
              validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null,
            ).animate().fadeIn(delay: 400.ms).slideX(begin: .1),
            const SizedBox(height: 30),

            // Buttons
            if (_isEditing)
              Row(children: [
                Expanded(
                  child: ElevatedButton.icon(
                    icon: _isSaving
                        ? const SizedBox(
                            width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Icon(Icons.save),
                    label: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      child: Text(_isSaving ? 'Saving…' : 'Save Profile'),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3CAC44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _isSaving ? null : _saveProfile,
                  ).animate().fadeIn(delay: 500.ms),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.cancel),
                    label: const Padding(
                      padding: EdgeInsets.symmetric(vertical: 15),
                      child: Text('Cancel'),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.red),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      setState(() {
                        _isEditing   = false;
                        _pickedImage = null;
                        final u = context.read<AuthProvider>().user!;
                        _fullNameC.text = u.fullName;
                        _emailC.text    = u.email;
                        _streetC.text   = u.district;
                        _phoneC.text    = u.phone ?? '';
                      });
                    },
                  ).animate().fadeIn(delay: 500.ms),
                ),
              ])
            else
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.edit),
                      label: const Padding(
                        padding: EdgeInsets.symmetric(vertical: 15),
                        child: Text('Edit Profile'),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF3CAC44),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () => setState(() => _isEditing = true),
                    ).animate().fadeIn(delay: 500.ms).slideY(begin: .5),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.logout),
                      label: const Padding(
                        padding: EdgeInsets.symmetric(vertical: 15),
                        child: Text('Logout'),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () async {
                        await context.read<AuthProvider>().logout();
                        if (mounted) context.go('/login');   // ← redirect
                      },
                    ).animate().fadeIn(delay: 600.ms).slideY(begin: .5),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
