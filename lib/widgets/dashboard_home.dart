// lib/widgets/dashboard_home.dart
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'package:video_player/video_player.dart';
import 'package:visibility_detector/visibility_detector.dart';

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
        child: Text('No user logged in', style: TextStyle(fontSize: 18)),
      );
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
                child: Text(
                  'Failed to load content',
                  style: TextStyle(color: Colors.red.shade700),
                ),
              ),
            );
          }
          final items = snap.data ?? [];
          if (items.isEmpty) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 40),
              child: Center(
                child: Text(
                  'No educational content yet',
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ),
            );
          }
          return Column(
            children: items.map((e) => _FeedCard(item: e)).toList(),
          );
        },
      );

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

  Widget _infoRow(IconData i, String l, String v) => Row(
        children: [
          Icon(i, color: Colors.green.shade700),
          const SizedBox(width: 15),
          Text('$l:',
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(width: 10),
          Expanded(
            child: Text(v,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 16, color: Colors.black87)),
          ),
        ],
      );

  Widget _statsRow(User u) => Column(
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
            child: Row(children: [
              _statCard('${u.cleanupsDone}', 'Cleanups', Icons.cleaning_services),
              _statCard('${u.points}', 'Points', Icons.star),
              _statCard('${u.badgesCount}', 'Badges', Icons.emoji_events),
            ]),
          )
        ],
      );

  Widget _statCard(String v, String l, IconData i) => Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        elevation: 3,
        shadowColor: Colors.green.shade100,
        margin: const EdgeInsets.only(right: 14),
        child: Container(
          width: 110,
          padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 12),
          child: Column(
            children: [
              Icon(i, size: 30, color: Colors.green.shade700),
              const SizedBox(height: 6),
              Text(v,
                  style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87)),
              const SizedBox(height: 4),
              Text(l,
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

class _FeedCard extends StatefulWidget {
  const _FeedCard({Key? key, required this.item}) : super(key: key);

  final EducationContent item;

  @override
  State<_FeedCard> createState() => _FeedCardState();
}

class _FeedCardState extends State<_FeedCard>
    with AutomaticKeepAliveClientMixin {
  VideoPlayerController? _vp;
  bool _processingLike = false;
  bool _initialAutoStarted = false;

  @override
  void initState() {
    super.initState();
    if (widget.item.kind == 'video') {
      _vp = VideoPlayerController.networkUrl(
        Uri.parse(widget.item.fileUrl!),
        httpHeaders: {'Accept': 'bytes'},  // ensures range requests
      )
        ..setLooping(true)
        ..initialize().then((_) {
          _vp!.setVolume(0); // silent → iOS autoplay allowed
          setState(() {});
        });
    }
  }

  @override
  void dispose() {
    _vp?.dispose();
    super.dispose();
  }

  void _handleVisibility(VisibilityInfo info) {
    if (_vp == null || !_vp!.value.isInitialized) return;

    if (!_initialAutoStarted &&
        info.visibleFraction >= 0.6 &&
        !_vp!.value.isPlaying) {
      _vp!.play();
      _initialAutoStarted = true;
      return;
    }

    if (info.visibleFraction >= 0.6 && !_vp!.value.isPlaying) {
      _vp!.play();
    } else if (info.visibleFraction < 0.6 && _vp!.value.isPlaying) {
      _vp!.pause();
    }
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

  Future<void> _addComment(String text) async {
    final c = await EducationService.addComment(widget.item.id, text);
    setState(() => widget.item.comments.add(c));
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final e = widget.item;

    Widget media;
    if (e.kind == 'comparison' &&
        e.beforeImages.isNotEmpty &&
        e.afterImages.isNotEmpty) {
      media = Row(
        children: [
          _thumb(e.beforeImages.first),
          const SizedBox(width: 4),
          _thumb(e.afterImages.first),
        ],
      );
    } else if (e.kind == 'image') {
      media = CachedNetworkImage(
        imageUrl: e.fileUrl!,
        fit: BoxFit.cover,
        progressIndicatorBuilder: (_, __, ___) =>
            Container(color: Colors.grey.shade200),
        errorWidget: (_, __, ___) => Container(
            color: Colors.grey.shade200, child: const Icon(Icons.broken_image)),
      );
    } else if (_vp != null && _vp!.value.isInitialized) {
      media = VisibilityDetector(
        key: Key('video-${e.id}'),
        onVisibilityChanged: _handleVisibility,
        child: AspectRatio(
          aspectRatio: _vp!.value.aspectRatio,
          child: VideoPlayer(_vp!),
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
      margin: const EdgeInsets.only(bottom: 22),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      clipBehavior: Clip.antiAlias,
      elevation: 4,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          media,
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 12, 14, 4),
            child:
                Text(e.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          ),
          if (e.description.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
              child: Text(e.description, style: TextStyle(color: Colors.grey[800])),
            ),
          Padding(
            padding: const EdgeInsets.fromLTRB(6, 4, 6, 8),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(
                    e.likedByMe ? Icons.favorite : Icons.favorite_border,
                    color: e.likedByMe ? Colors.red : Colors.grey.shade600,
                  ),
                  onPressed: _toggleLike,
                ),
                Text('${e.likeCount}',
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.comment_outlined, size: 20, color: Colors.grey),
                  onPressed: () => showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    builder: (_) => CommentSheet(onSend: _addComment),
                  ),
                ),
                Text(' ${e.comments.length}'),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.open_in_new),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => EducationPlayerScreen(item: e)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _thumb(String url) => Expanded(
        child: CachedNetworkImage(
          imageUrl: url,
          fit: BoxFit.cover,
          height: 150,
          progressIndicatorBuilder: (_, __, ___) =>
              Container(height: 150, color: Colors.grey.shade200),
          errorWidget: (_, __, ___) => Container(
              height: 150,
              color: Colors.grey.shade200,
              child: const Icon(Icons.broken_image)),
        ),
      );

  @override
  bool get wantKeepAlive => true;
}

class CommentSheet extends StatefulWidget {
  const CommentSheet({super.key, required this.onSend});
  final Future<void> Function(String text) onSend;

  @override
  State<CommentSheet> createState() => _CommentSheetState();
}

class _CommentSheetState extends State<CommentSheet> {
  final _ctl = TextEditingController();
  bool _sending = false;

  Future<void> _submit() async {
    if (_ctl.text.trim().isEmpty || _sending) return;
    setState(() => _sending = true);
    await widget.onSend(_ctl.text.trim());
    if (mounted) {
      _ctl.clear();
      setState(() => _sending = false);
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) => Padding(
        padding: MediaQuery.of(context).viewInsets,
        child: SafeArea(
          top: false,
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _ctl,
                  maxLines: 3,
                  minLines: 1,
                  decoration: const InputDecoration(
                    hintText: 'Add a comment…',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 14),
                  ),
                ),
              ),
              IconButton(
                icon: _sending
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.send),
                onPressed: _submit,
              )
            ],
          ),
        ),
      );
}
