// lib/screens/rewards_screen.dart

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/user.dart';
import '../models/reward.dart';
import '../models/cleanup.dart';
import '../services/auth_service.dart';
import '../services/reward_service.dart';
import '../services/cleanup_service.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({Key? key}) : super(key: key);

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  late Future<_Data> _future;

  @override
  void initState() {
    super.initState();
    _future = _loadAll();
  }

  Future<_Data> _loadAll() async {
    final profile     = await AuthService.fetchProfile();
    final userId      = profile.id;
    final badges      = await RewardService.fetchUserRewards(userId);
    final myCreated   = await CleanupService.fetchMyCleanups();
    final allCleanups = await CleanupService.fetchCleanups();

    final volCount = allCleanups
        .where((c) => c.volunteers.contains(userId))
        .length;
    final compCount = myCreated
        .where((c) => c.status.toLowerCase() == 'completed')
        .length;

    return _Data(
      profile:         profile,
      earnedBadges:    badges,
      createdCount:    myCreated.length,
      volunteerCount:  volCount,
      completedCount:  compCount,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rewards & Badges'),
        backgroundColor:Colors.white70,
      ),
      body: FutureBuilder<_Data>(
        future: _future,
        builder: (ctx, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snap.hasError) {
            return Center(child: Text('Error: ${snap.error}'));
          }
          return _buildBody(snap.data!);
        },
      ),
    );
  }

  Widget _buildBody(_Data d) {
    final points      = d.profile.points;
    final level       = (points / 1000).floor() + 1;
    final xpThisLevel = points % 1000;
    const xpForNext   = 1000;

    final miles = [
      _Mile('Request 1 Cleanup',    d.createdCount,   1),
      _Mile('Volunteer 5 Times',    d.volunteerCount, 5),
      _Mile('Complete 3 Cleanups',  d.completedCount, 3),
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ─── Level & XP Card ───────────────────────────
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      SizedBox(
                        width: 72, height: 72,
                        child: CircularProgressIndicator(
                          value: xpThisLevel / xpForNext,
                          strokeWidth: 8,
                          color: Colors.green,
                          backgroundColor: Colors.grey.shade300,
                        ),
                      ),
                      Text(
                        'Lv $level',
                        style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$xpThisLevel / $xpForNext XP',
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: xpThisLevel / xpForNext,
                            minHeight: 10,
                            color: Colors.green,
                            backgroundColor: Colors.grey.shade300,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // ─── Badges Card ───────────────────────────────
          Text('Badges', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          Card(
            elevation: 1,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
              child: GridView.count(
                crossAxisCount: 4,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.7,      // ← give more vertical room
                children: _allBadges.map((def) {
                  final earned = d.earnedBadges.any((b) => b.badgeName == def.name);
                  return Stack(
                    alignment: Alignment.center,
                    children: [
                      Opacity(
                        opacity: earned ? 1 : 0.4,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CircleAvatar(
                              radius: 24,
                              backgroundColor: Colors.green.shade50,
                              child: Icon(def.icon, size: 28, color: Colors.green.shade700),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              def.name,
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      if (!earned)
                        const Icon(Icons.lock, color: Colors.grey, size: 18),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // ─── Milestones Card ────────────────────────────
          Text('Milestones', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          Card(
            elevation: 1,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: miles.map((m) {
                  final progress = (m.current / m.target).clamp(0.0, 1.0);
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(m.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                        const SizedBox(height: 6),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: progress,
                            minHeight: 10,
                            color: Colors.orange,
                            backgroundColor: Colors.grey.shade300,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${(progress * 100).toStringAsFixed(0)}%',
                          style: const TextStyle(fontSize: 12, color: Colors.black54),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Master list of **all** possible badges in the app
final List<_BadgeDef> _allBadges = [
  _BadgeDef('First Cleanup',    Icons.flag),
  _BadgeDef('Volunteer Star',   Icons.handshake),
  _BadgeDef('Community Hero',   Icons.emoji_events),
  _BadgeDef('Earth Saver',      Icons.public),
];

class _BadgeDef {
  final String name;
  final IconData icon;
  _BadgeDef(this.name, this.icon);
}

class _Data {
  final User            profile;
  final List<Reward>    earnedBadges;
  final int             createdCount,
                        volunteerCount,
                        completedCount;
  _Data({
    required this.profile,
    required this.earnedBadges,
    required this.createdCount,
    required this.volunteerCount,
    required this.completedCount,
  });
}

class _Mile {
  final String title;
  final int    current, target;
  _Mile(this.title, this.current, this.target);
}
