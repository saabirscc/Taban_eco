// lib/widgets/cleanups_tabview.dart

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../screens/cleanup_list_screen.dart';
import '../screens/scheduledlistscreen.dart'; 

class CleanupsTabView extends StatelessWidget {
  const CleanupsTabView({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Column(
        children: [
          Container(
            color: Colors.white,
            child: const TabBar(
              indicatorColor: Color(0xFF2FAC40),
              labelColor: Color(0xFF2FAC40),
              unselectedLabelColor: Colors.grey,
              tabs: [
                Tab(text: 'My Cleanups'),
                Tab(text: 'Scheduled'),
              ],
            ).animate().fadeIn(delay: 100.ms),
          ),
          const Expanded(
            child: TabBarView(
              children: [
                CleanupListScreen(),
                ScheduledListScreen(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
