import 'package:flutter/material.dart';
import '../services/cleanup_service.dart';
import '../models/volunteer.dart';

class VolunteersWidget extends StatefulWidget {
  final String cleanupId;
  const VolunteersWidget({Key? key, required this.cleanupId}) : super(key: key);

  @override
  State<VolunteersWidget> createState() => _VolunteersWidgetState();
}

class _VolunteersWidgetState extends State<VolunteersWidget> {
  late Future<List<Volunteer>> _future;

  @override
  void initState() {
    super.initState();
    _future = CleanupService.fetchVolunteers(widget.cleanupId);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Volunteer>>(
      future: _future,
      builder: (ctx, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snap.hasError) {
          return Text('Error: ${snap.error}', style: const TextStyle(color: Colors.red));
        }
        final vols = snap.data ?? [];
        if (vols.isEmpty) {
          return Text('No volunteers yet', style: TextStyle(color: Colors.grey[600]));
        }

        return Wrap(
          spacing: 8,
          runSpacing: 6,
          children: vols.map((v) => _VolunteerChip(v)).toList(),
        );
      },
    );
  }
}

class _VolunteerChip extends StatelessWidget {
  final Volunteer v;
  const _VolunteerChip(this.v);

  @override
  Widget build(BuildContext context) {
    return Chip(
      avatar: v.avatarUrl != null
          ? CircleAvatar(backgroundImage: NetworkImage(v.avatarUrl!))
          : const CircleAvatar(child: Icon(Icons.person)),
      label: Text(v.fullName),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    );
  }
}
