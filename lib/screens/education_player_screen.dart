import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../models/education_content.dart';
import '../services/education_service.dart';

class EducationPlayerScreen extends StatefulWidget {
  final EducationContent item;
  const EducationPlayerScreen({Key? key, required this.item}) : super(key: key);

  @override
  State<EducationPlayerScreen> createState() => _EducationPlayerScreenState();
}

class _EducationPlayerScreenState extends State<EducationPlayerScreen> {
  VideoPlayerController? _vp;

  @override
  void initState() {
    super.initState();
    if (widget.item.kind == 'video') {
      _vp = VideoPlayerController.networkUrl(
        Uri.parse(widget.item.fileUrl!),
        httpHeaders: {'Accept': 'bytes'},  // ensures range requests → 206 Partial Content
      )
        ..initialize().then((_) => setState(() {}));
    }
  }

  @override
  void dispose() {
    _vp?.dispose();
    super.dispose();
  }

  Future<void> _toggleLike() async {
    await EducationService.toggleLike(widget.item.id);
    setState(() {
      widget.item.likedByMe = !widget.item.likedByMe;
      widget.item.likeCount += widget.item.likedByMe ? 1 : -1;
    });
  }

  Future<void> _addComment(String txt) async {
    final c = await EducationService.addComment(widget.item.id, txt);
    setState(() => widget.item.comments.add(c));
  }

  Widget _labeledImage(String url, String label) => Expanded(
        child: Stack(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: CachedNetworkImage(
                imageUrl: url,
                fit: BoxFit.cover,
                width: double.infinity,
                height: 280,
                placeholder: (_, __) => Container(
                  height: 280,
                  color: Colors.grey.shade200,
                ),
                errorWidget: (_, __, ___) => Container(
                  height: 280,
                  color: Colors.grey.shade300,
                  child: const Icon(Icons.broken_image),
                ),
              ),
            ),
            Positioned(
              bottom: 12,
              left: 12,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(label,
                    style: const TextStyle(
                        color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      );

  @override
  Widget build(BuildContext context) {
    final e = widget.item;

    late final Widget media;
    if (e.kind == 'comparison' &&
        e.beforeImages.isNotEmpty &&
        e.afterImages.isNotEmpty) {
      media = Row(
        children: [
          _labeledImage(e.beforeImages.first, 'BEFORE'),
          const SizedBox(width: 8),
          _labeledImage(e.afterImages.first, 'AFTER'),
        ],
      );
    } else if (e.kind == 'image') {
      media = ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: CachedNetworkImage(
          imageUrl: e.fileUrl!,
          fit: BoxFit.cover,
          width: double.infinity,
          height: 280,
          placeholder: (_, __) =>
              Container(height: 280, color: Colors.grey.shade200),
          errorWidget: (_, __, ___) => Container(
              height: 280,
              color: Colors.grey.shade200,
              child: const Icon(Icons.broken_image)),
        ),
      );
    } else if (_vp != null && _vp!.value.isInitialized) {
      media = ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: AspectRatio(
          aspectRatio: _vp!.value.aspectRatio,
          child: VideoPlayer(_vp!),
        ),
      );
    } else {
      media = ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Container(
          height: 280,
          color: Colors.grey.shade200,
          child: const Center(child: CircularProgressIndicator()),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // HEADER
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.arrow_back, size: 28),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      e.title,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const CircleAvatar(
                    radius: 18,
                    backgroundImage:
                        AssetImage('assets/avatar_placeholder.png'),
                  ),
                ],
              ),
            ),

            // MEDIA
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: media,
            ),

            // ACTIONS
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(
                      e.likedByMe ? Icons.favorite : Icons.favorite_border,
                      size: 28,
                      color: e.likedByMe ? Colors.red : Colors.grey.shade700,
                    ),
                    onPressed: _toggleLike,
                  ),
                  IconButton(
                    icon: const Icon(Icons.comment_outlined,
                        size: 28, color: Colors.grey),
                    onPressed: () => showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      builder: (_) => _CommentSheet(onSend: _addComment),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.share_outlined,
                        size: 28, color: Colors.grey),
                    onPressed: () {
                      // TODO: share post
                    },
                  ),
                ],
              ),
            ),

            // LIKES + DESCRIPTION + COMMENTS
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  Text('${e.likeCount} likes',
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 8),
                  RichText(
                    text: TextSpan(
                      children: [
                        const TextSpan(
                            text: 'Username ',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.black)),
                        TextSpan(
                            text: e.description,
                            style: const TextStyle(color: Colors.black87)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Divider(),
                  ...e.comments.map(
                    (c) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 14,
                            backgroundImage: c.avatar != null
                                ? NetworkImage(c.avatar!)
                                : const AssetImage(
                                        'assets/avatar_placeholder.png')
                                    as ImageProvider,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                      text: '${c.userName} ',
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black)),
                                  TextSpan(
                                      text: c.text,
                                      style: const TextStyle(
                                          color: Colors.black87)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CommentSheet extends StatefulWidget {
  const _CommentSheet({required this.onSend});
  final Future<void> Function(String text) onSend;

  @override
  State<_CommentSheet> createState() => _CommentSheetState();
}

class _CommentSheetState extends State<_CommentSheet> {
  final _ctl = TextEditingController();
  bool _sending = false;

  Future<void> _submit() async {
    final txt = _ctl.text.trim();
    if (txt.isEmpty || _sending) return;
    setState(() => _sending = true);
    await widget.onSend(txt);
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
                        child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.send),
                onPressed: _submit,
              )
            ],
          ),
        ),
      );
}
