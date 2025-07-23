import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

import '../models/cleanup.dart';
import '../models/volunteer.dart';
import '../services/cleanup_service.dart';
import '../services/auth_service.dart';
import 'cleanup_form_screen.dart';
import 'scheduled_map_view.dart';

/* ───── brand colours ─────────────────────────────────────────── */
const _borderGreen = Color(0xFF2FAC40);
const _lightMint   = Color(0xFFE5ECE0);
const _lightGreen  = Color(0xFFB6D5A5);
const _orange      = Color(0xFFFF6B00);
const _highRed     = Color(0xFFD32F2F);

/* ───── generic converters ───────────────────────────────────── */
String _asString(dynamic v) {
  if (v == null) return '';
  if (v is String) return v;
  if (v is Map && v.isNotEmpty) return v.values.first.toString();
  return v.toString();
}

DateTime? _asDate(dynamic v) {
  if (v == null) return null;
  if (v is DateTime) return v;
  if (v is int)      return DateTime.fromMillisecondsSinceEpoch(v);
  if (v is String)   { try { return DateTime.parse(v); } catch (_) {} }
  return null;
}

/* ───── helpers ──────────────────────────────────────────────── */
Color _statusColor(String status, ColorScheme scheme) {
  switch (status.toLowerCase()) {
    case 'completed': return scheme.primary;
    case 'scheduled': return scheme.tertiary;
    case 'rejected':
    case 'cancelled': return scheme.error;
    default:          return _borderGreen;
  }
}

Color _severityBg(String sev) {
  switch (sev.toLowerCase()) {
    case 'moderate': return _orange;
    case 'high':     return _highRed;
    default:         return _lightGreen;
  }
}

extension CapExt on String {
  String capitalize() =>
      isNotEmpty ? '${this[0].toUpperCase()}${substring(1)}' : this;
}

/* ─────────────────── screen ─────────────────── */
class ScheduledListScreen extends StatefulWidget {
  const ScheduledListScreen({Key? key}) : super(key: key);

  @override
  State<ScheduledListScreen> createState() => _ScheduledListScreenState();
}

class _ScheduledListScreenState extends State<ScheduledListScreen> {
  late Future<List<Cleanup>> _future;
  bool   _showMap  = false;
  String? _myUserId;

  @override
  void initState() {
    super.initState();
    _future = CleanupService.fetchCleanups();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final me = context.read<AuthProvider>().userId;
      if (mounted) setState(() => _myUserId = me);
    });
  }

  Future<void> _refresh() async =>
      setState(() => _future = CleanupService.fetchCleanups());

  Future<void> _toggleVolunteer(Cleanup c) async {
    if (_myUserId == null || c.createdById == _myUserId) return;
    final isVol = c.volunteers.contains(_myUserId);
    List<Volunteer> updated = isVol
        ? await CleanupService.leaveCleanup(c.id)
        : await CleanupService.joinCleanup(c.id);
    setState(() => c.volunteers = updated.map((v) => v.id).toList());
  }

  @override
  Widget build(BuildContext context) {
    final scheme  = Theme.of(context).colorScheme;
    final surface = scheme.surface;

    return Scaffold(
      backgroundColor: surface,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: surface,
        foregroundColor: scheme.onSurface,
        title: const Text('Scheduled & Approved'),
        centerTitle: true,
        actions: [
          ToggleButtons(
            isSelected: [_showMap, !_showMap],
            onPressed: (i) => setState(() => _showMap = i == 0),
            children: const [
              Padding(padding: EdgeInsets.symmetric(horizontal: 12), child: Icon(Icons.map)),
              Padding(padding: EdgeInsets.symmetric(horizontal: 12), child: Icon(Icons.list)),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        color: scheme.primary,
        onRefresh: _refresh,
        child: FutureBuilder<List<Cleanup>>(
          future: _future,
          builder: (context, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snap.hasError) {
              return Center(child: Text('Error: ${snap.error}'));
            }

            final all = snap.data ?? [];
            final items = all.where((c) {
              final s = _asString(c.status).toLowerCase();
              return s == 'scheduled' || s == 'approved';
            }).toList();

            if (items.isEmpty) {
              return const Center(child: Text('No scheduled or approved clean-ups'));
            }

            if (_showMap) {
              return ScheduledMapView(items: items, onRefresh: _refresh);
            }

            return ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 120),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (_, i) {
                final c = items[i];
                final isOwner = _myUserId != null && c.createdById == _myUserId;
                return _CleanupCard(
                  cleanup       : c,
                  currentUserId : _myUserId,
                  isOwner       : isOwner,
                  onVolunteerToggled: () => _toggleVolunteer(c),
                  onTap: () async {
                    final changed = await Navigator.push<bool>(
                      context,
                      MaterialPageRoute(builder: (_) => CleanupFormScreen(cleanup: c)),
                    );
                    if (changed == true) _refresh();
                  },
                );
              },
            );
          },
        ),
      ),
    );
  }
}

/* ───────────────────── card widget ───────────────────── */
class _CleanupCard extends StatelessWidget {
  final Cleanup      cleanup;
  final String?      currentUserId;
  final bool         isOwner;
  final VoidCallback onVolunteerToggled;
  final VoidCallback onTap;

  const _CleanupCard({
    Key? key,
    required this.cleanup,
    required this.currentUserId,
    required this.isOwner,
    required this.onVolunteerToggled,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final scheme    = Theme.of(context).colorScheme;

    final statusStr = _asString(cleanup.status).capitalize();
    final isPending = statusStr.toLowerCase() == 'pending';
    final date      = _asDate(cleanup.scheduledDate);
    final sevRaw    = _asString(cleanup.severity);
    final sevLower  = sevRaw.toLowerCase();
    final amIVol    = !isOwner &&
        currentUserId != null &&
        cleanup.volunteers.contains(currentUserId);
    final title   = _asString(cleanup.title);
    final photoUrl = cleanup.photoUrls.isNotEmpty
        ? _asString(cleanup.photoUrls.first)
        : null;

    return Container(
      decoration: BoxDecoration(
        border: Border(left: BorderSide(color: _borderGreen, width: 5)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Material(
        elevation: 2,
        color: scheme.surface,
        borderRadius: BorderRadius.circular(16),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: IntrinsicHeight(
            child: Row(
              children: [
                // ← updated thumbnail
                if (photoUrl != null && photoUrl.isNotEmpty)
                  ClipRRect(
                    borderRadius: const BorderRadius.only(
                      topRight: Radius.circular(10),
                      bottomRight: Radius.circular(10),
                    ),
                    child: Image.network(
                      photoUrl,
                      width: 96,
                      height: 96,
                      fit: BoxFit.cover,
                      loadingBuilder: (context, child, progress) {
                        if (progress == null) return child;
                        return Container(
                          width: 96,
                          height: 96,
                          color: _lightMint,
                          child: const Center(
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                        );
                      },
                      errorBuilder: (context, error, stack) {
                        return Container(
                          width: 96,
                          height: 96,
                          color: _lightMint,
                          child: const Center(child: Icon(Icons.broken_image)),
                        );
                      },
                    ),
                  )
                else
                  Container(
                    width: 96,
                    height: 96,
                    margin: const EdgeInsets.only(right: 16),
                    decoration: BoxDecoration(
                      color: scheme.primaryContainer,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(Icons.photo,
                        size: 32, color: scheme.onPrimaryContainer),
                  ),
                const SizedBox(width: 16),

                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: scheme.primary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              date != null ? DateFormat.yMMMd().format(date) : '—',
                              style: TextStyle(fontSize: 13, color: scheme.onSurfaceVariant),
                            ),
                            const SizedBox(width: 16),
                            const Icon(Icons.schedule, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              date != null ? DateFormat.jm().format(date) : '—',
                              style: TextStyle(fontSize: 13, color: scheme.onSurfaceVariant),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: -6,
                          children: [
                            Chip(
                              label: Text(statusStr),
                              padding: EdgeInsets.zero,
                              visualDensity: VisualDensity.compact,
                              labelStyle: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isPending
                                    ? _borderGreen
                                    : _statusColor(statusStr, scheme),
                              ),
                              backgroundColor: isPending
                                  ? _lightMint
                                  : _statusColor(statusStr, scheme).withOpacity(.15),
                            ),
                            Builder(builder: (_) {
                              final bg   = _severityBg(sevLower);
                              final tCol = (sevLower == 'moderate' || sevLower == 'high')
                                  ? Colors.white
                                  : _borderGreen;
                              return Chip(
                                label: Text(sevRaw.capitalize(),
                                    style: TextStyle(color: tCol)),
                                padding: EdgeInsets.zero,
                                visualDensity: VisualDensity.compact,
                                backgroundColor: bg,
                              );
                            }),
                          ],
                        ),
                        const SizedBox(height: 12),
                        if (!isOwner)
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: onVolunteerToggled,
                              child: Text(amIVol ? 'Leave' : 'Volunteer'),
                            ),
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
}
