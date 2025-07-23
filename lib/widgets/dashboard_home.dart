import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'package:video_player/video_player.dart';

import '../models/education_content.dart';
import '../models/user.dart';
import '../providers/auth_provider.dart';
import '../services/education_service.dart';
import '../screens/education_player_screen.dart';

class DashboardHome extends StatefulWidget {
  const DashboardHome({Key? key}) : super(key: key);

  @override
  State<DashboardHome> createState() => _DashboardHomeState();
}

class _DashboardHomeState extends State<DashboardHome> {
  late Future<List<EducationContent>> _eduFuture;

  @override
  void initState() {
    super.initState();
    final me = context.read<AuthProvider>().user!;
    _eduFuture = EducationService.fetchAll(me.id);
  }

  Future<void> _refresh() async {
    final me = context.read<AuthProvider>().user!;
    setState(() => _eduFuture = EducationService.fetchAll(me.id));
    await _eduFuture;
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    if (user == null) {
      return const Center(
          child: Text('No user logged in', style: TextStyle(fontSize: 18)));
    }

    return RefreshIndicator(
      onRefresh: _refresh,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
        children: [
          _greeting(user),
          const SizedBox(height: 25),
          _infoCard(user),
          const SizedBox(height: 30),
          _statsRow(user),
          const SizedBox(height: 35),
          _learningHubHeader(),
          const SizedBox(height: 10),
          _feed(),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  /* ─────────────  FEED  ───────────── */

  Widget _feed() => FutureBuilder<List<EducationContent>>(
        future: _eduFuture,
        builder: (_, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snap.hasError) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 40),
              child: Center(
                  child: Text('Failed to load content',
                      style: TextStyle(color: Colors.red.shade700))),
            );
          }
          final items = snap.data ?? [];
          if (items.isEmpty) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 40),
              child: Center(
                  child: Text('No educational content yet',
                      style: TextStyle(color: Colors.grey.shade600))),
            );
          }
          return Column(children: items.map((e) => _FeedCard(item: e)).toList());
        },
      );

  /* ─────────────  HEADER + STATS  ───────────── */

  Widget _greeting(User user) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Welcome back,',
                  style: TextStyle(fontSize: 18, color: Colors.grey.shade700))
              .animate()
              .fadeIn(delay: 100.ms)
              .slideX(begin: 0.1),
          const SizedBox(height: 5),
          Text(user.fullName,
                  style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87))
              .animate()
              .fadeIn(delay: 200.ms)
              .slideX(begin: 0.1),
        ],
      );

  Widget _infoCard(User user) => Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        elevation: 3,
        shadowColor: Colors.green.shade100,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              _infoRow(Icons.email, 'Email', user.email),
              const Divider(height: 30),
              _infoRow(Icons.location_city, 'District', user.district),
              const Divider(height: 30),
              _infoRow(Icons.phone, 'Phone', user.phone ?? 'N/A'),
            ],
          ),
        ),
      );

  Widget _infoRow(IconData icon, String label, String value) => Row(
        children: [
          Icon(icon, color: Colors.green.shade700),
          const SizedBox(width: 15),
          Text('$label:',
              style:
                  const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(width: 10),
          Expanded(
            child: Text(value,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 16, color: Colors.black87)),
          ),
        ],
      );

  Widget _statsRow(User user) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Your Activity',
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Colors.green.shade700)),
          const SizedBox(height: 15),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _statCard('${user.cleanupsDone}', 'Cleanups Done',
                    Icons.cleaning_services),
                _statCard('${user.points}', 'Points Earned', Icons.star),
                _statCard('${user.badgesCount}', 'Badges', Icons.emoji_events),
              ],
            ),
          ),
        ],
      );

  Widget _statCard(String value, String label, IconData icon) => Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        elevation: 3,
        shadowColor: Colors.green.shade100,
        margin: const EdgeInsets.only(right: 14),
        child: Container(
          width: 120,
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
          child: Column(
            children: [
              Icon(icon, size: 36, color: Colors.green.shade700),
              const SizedBox(height: 10),
              Text(value,
                  style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87)),
              const SizedBox(height: 5),
              Text(label,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.black54)),
            ],
          ),
        ),
      );

  Widget _learningHubHeader() => Row(
        children: [
          Icon(Icons.school, color: Colors.green.shade700),
          const SizedBox(width: 8),
          Text('Learning Hub',
              style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  color: Colors.green.shade700)),
        ],
      );
}

/* ═════════════════════════════════════════════════════ */
/*                      FEED CARD                       */
/* ═════════════════════════════════════════════════════ */

class _FeedCard extends StatefulWidget {
  final EducationContent item;
  const _FeedCard({Key? key, required this.item}) : super(key: key);

  @override
  State<_FeedCard> createState() => _FeedCardState();
}

class _FeedCardState extends State<_FeedCard> {
  VideoPlayerController? _vp;
  bool _processingLike = false;

  @override
  void initState() {
    super.initState();
    if (widget.item.kind == 'video') {
      _vp = VideoPlayerController.networkUrl(Uri.parse(widget.item.fileUrl))
        ..initialize().then((_) => setState(() {}));
    }
  }

  @override
  void dispose() {
    _vp?.dispose();
    super.dispose();
  }

  Future<void> _toggleLike() async {
    if (_processingLike) return;
    setState(() => _processingLike = true);
    await EducationService.toggleLike(widget.item.id);
    setState(() {
      widget.item.likedByMe = !widget.item.likedByMe;
      widget.item.likeCount += widget.item.likedByMe ? 1 : -1;
      _processingLike = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final e = widget.item;

    Widget media;
    if (e.kind == 'image') {
      media = CachedNetworkImage(
        imageUrl: e.fileUrl,
        fit: BoxFit.cover,
        progressIndicatorBuilder: (_, __, ___) =>
            Container(color: Colors.grey.shade200),
        errorWidget: (_, __, ___) =>
            Container(color: Colors.grey.shade200, child: const Icon(Icons.image)),
      );
    } else if (_vp != null && _vp!.value.isInitialized) {
      media = GestureDetector(
        onTap: () => setState(
            () => _vp!.value.isPlaying ? _vp!.pause() : _vp!.play()),
        child: Stack(
          alignment: Alignment.center,
          children: [
            AspectRatio(
              aspectRatio: _vp!.value.aspectRatio,
              child: VideoPlayer(_vp!),
            ),
            if (!_vp!.value.isPlaying)
              const Icon(Icons.play_circle, size: 64, color: Colors.white),
          ],
        ),
      );
    } else {
      media = Container(
        height: 250,
        color: Colors.grey.shade200,
        child: const Center(child: CircularProgressIndicator()),
      );
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 20),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      clipBehavior: Clip.antiAlias,
      elevation: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          media,
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Text(e.title,
                style:
                    const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
          ),
          if (e.description.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Text(e.description,
                  style: TextStyle(color: Colors.grey.shade800)),
            ),
          Padding(
            padding: const EdgeInsets.fromLTRB(8, 4, 8, 8),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(Icons.thumb_up,
                      color: e.likedByMe
                          ? Colors.green.shade700
                          : Colors.grey.shade600),
                  onPressed: _toggleLike,
                ),
                Text('${e.likeCount}'),
                const SizedBox(width: 16),
                Icon(Icons.chat_bubble_outline,
                    size: 20, color: Colors.grey.shade600),
                Text(' ${e.comments.length}'),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.open_in_new),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => EducationPlayerScreen(item: e)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
