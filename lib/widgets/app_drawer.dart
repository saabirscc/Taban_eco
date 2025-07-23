// lib/widgets/app_drawer.dart

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class AppDrawer extends StatelessWidget {
  final void Function(int?) onSelect;
  const AppDrawer({required this.onSelect, super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;

    Widget tile(IconData icon, String title, int idx) => ListTile(
          leading: Icon(icon, color: Colors.green.shade700),
          title: Text(title, style: TextStyle(color: Colors.grey.shade800)),
          onTap: () => onSelect(idx),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        );

    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            UserAccountsDrawerHeader(
              decoration: BoxDecoration(
                color: Colors.green.shade700,
                boxShadow: [
                  BoxShadow(
                    color: Colors.green.shade900.withOpacity(0.3),
                    spreadRadius: 2,
                    blurRadius: 5,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.green.shade300,
                backgroundImage: user?.profilePicture != null
                    ? NetworkImage(user!.profilePicture!)
                    : null,
                child: user?.profilePicture == null
                    ? Text(
                        user?.fullName[0].toUpperCase() ?? '?',
                        style: const TextStyle(fontSize: 32, color: Colors.white),
                      )
                    : null,
              ).animate().shake(),
              accountName: Text(user?.fullName ?? '',
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              accountEmail: Text(user?.email ?? ''),
            ),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  tile(Icons.dashboard, 'Dashboard', 0),
                  tile(Icons.home_rounded, 'Welcome', 1),
                  tile(Icons.cleaning_services, 'Cleanups', 2),
                  tile(Icons.map, 'Map', 3),
                  tile(Icons.feedback, 'Feedback', 4),
                  tile(Icons.contact_phone, 'Contact', 5),
                ]
                    .animate(interval: 80.ms)
                    .slideX(begin: -0.5),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.cancel),
              title: const Text('Close'),
              onTap: () => onSelect(null),
            ).animate().fadeIn(delay: 600.ms),
          ],
        ),
      ),
    );
  }
}
