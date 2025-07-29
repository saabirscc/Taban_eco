// lib/screens/cleanup_list_screen.dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/cleanup.dart';
import '../services/cleanup_service.dart';
import 'cleanup_form_screen.dart';

/* ───── palette ─────────────────────────────────────────── */
const _borderGreen = Color(0xFF2FAC40);
const _lightMint   = Color(0xFFE5ECE0);
const _lightGreen  = Color(0xFFB6D5A5);
const _orange      = Color(0xFFFF6B00);
const _highRed     = Color(0xFFD32F2F);

/* ───── helpers ─────────────────────────────────────────── */
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

/// Make sure we can display the image no matter if the backend
/// returned a full URL or just `/uploads/…`
String _absolute(String url) {
  if (url.startsWith('http')) return url;
  return '${CleanupService.baseUrl}$url';
}

/* ───── screen ─────────────────────────────────────────── */
class CleanupListScreen extends StatefulWidget {
  const CleanupListScreen({Key? key}) : super(key: key);

  @override
  State<CleanupListScreen> createState() => _CleanupListScreenState();
}

class _CleanupListScreenState extends State<CleanupListScreen> {
  late Future<List<Cleanup>> _future;

  @override
  void initState() {
    super.initState();
    _future = CleanupService.fetchMyCleanups();
  }

  Future<void> _refresh() async =>
      setState(() => _future = CleanupService.fetchMyCleanups());

  @override
  Widget build(BuildContext context) {
    final scheme  = Theme.of(context).colorScheme;
    final surface = scheme.surface;

    return Scaffold(
      backgroundColor: scheme.background,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: surface,
        foregroundColor: scheme.onSurface,
        title: const Text('My Cleanup Requests'),
        centerTitle: true,
      ),
      body: RefreshIndicator(
        color: scheme.primary,
        onRefresh: _refresh,
        child: FutureBuilder<List<Cleanup>>(
          future: _future,
          builder: (_, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snap.hasError) {
              return Center(child: Text('Error: ${snap.error}'));
            }

            final items = snap.data ?? [];
            if (items.isEmpty) {
              return const Center(child: Text('No cleanup requests yet'));
            }

            return ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 120),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (_, i) => _CleanupCard(
                cleanup: items[i],
                onTap: () async {
                  final changed = await Navigator.push<bool>(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CleanupFormScreen(cleanup: items[i]),
                    ),
                  );
                  if (changed == true) _refresh();
                },
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: scheme.primary,
        icon : const Icon(Icons.add),
        label: const Text('New'),
        onPressed: () async {
          final changed = await Navigator.push<bool>(
            context,
            MaterialPageRoute(builder: (_) => const CleanupFormScreen()),
          );
          if (changed == true) _refresh();
        },
      ),
    );
  }
}

/* ───── card ─────────────────────────────────────────── */
class _CleanupCard extends StatelessWidget {
  final Cleanup cleanup;
  final VoidCallback onTap;
  const _CleanupCard({Key? key, required this.cleanup, required this.onTap})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final scheme    = Theme.of(context).colorScheme;
    final statusCap = cleanup.status.capitalize();
    final isPending = cleanup.status.toLowerCase() == 'pending';

    /* -------- decide thumbnail -------- */
    String? thumb;
    if (cleanup.beforeImages.isNotEmpty) {
      thumb = cleanup.beforeImages.first;
    } else if (cleanup.photoUrls.isNotEmpty) {
      thumb = cleanup.photoUrls.first;
    }

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
                if (thumb != null)
                  _image(_absolute(thumb))
                else
                  _placeholder(),

                const SizedBox(width: 16),

                /* ── details ── */
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          cleanup.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: scheme.primary,
                              ),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              cleanup.scheduledDate != null
                                  ? DateFormat.yMMMd().format(cleanup.scheduledDate!)
                                  : '—',
                              style: TextStyle(
                                  fontSize: 13, color: scheme.onSurfaceVariant),
                            ),
                            const SizedBox(width: 16),
                            const Icon(Icons.schedule, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              cleanup.scheduledDate != null
                                  ? DateFormat.jm().format(cleanup.scheduledDate!)
                                  : '—',
                              style: TextStyle(
                                  fontSize: 13, color: scheme.onSurfaceVariant),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: -6,
                          children: [
                            Chip(
                              label: Text(statusCap),
                              visualDensity: VisualDensity.compact,
                              padding: EdgeInsets.zero,
                              labelStyle: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isPending
                                    ? _borderGreen
                                    : _statusColor(statusCap, scheme),
                              ),
                              backgroundColor: isPending
                                  ? _lightMint
                                  : _statusColor(statusCap, scheme).withOpacity(.15),
                            ),
                            Chip(
                              label: Text(cleanup.severity.capitalize()),
                              visualDensity: VisualDensity.compact,
                              padding: EdgeInsets.zero,
                              backgroundColor: _severityBg(cleanup.severity),
                              labelStyle: TextStyle(
                                color: (cleanup.severity == 'moderate' ||
                                        cleanup.severity == 'high')
                                    ? Colors.white
                                    : _borderGreen,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.location_pin,
                                size: 16, color: scheme.primary.withOpacity(.8)),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(cleanup.location,
                                  style: const TextStyle(fontSize: 14)),
                            ),
                          ],
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

  Widget _image(String url) {
    return ClipRRect(
      borderRadius: const BorderRadius.only(
        topRight: Radius.circular(10),
        bottomRight: Radius.circular(10),
      ),
      child: Image.network(
        url,
        width : 96,
        height: 96,
        fit   : BoxFit.cover,
        loadingBuilder: (c, child, prog) =>
            prog == null ? child : _loadingBox(),
        errorBuilder   : (_, __, ___) => _placeholder(),
      ),
    );
  }

  Widget _loadingBox() => Container(
        width: 96,
        height: 96,
        color : _lightMint,
        child : const Center(child: CircularProgressIndicator(strokeWidth: 2)),
      );

  Widget _placeholder() => Container(
        width : 96,
        height: 96,
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          color: _lightMint,
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Icon(Icons.photo, size: 32),
      );
}

extension CapExt on String {
  String capitalize() =>
      isNotEmpty ? '${this[0].toUpperCase()}${substring(1)}' : this;
}
