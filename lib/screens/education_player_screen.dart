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
    await EducationService.toggleLike(widget.item.id);
    setState(() {
      widget.item.likedByMe = !widget.item.likedByMe;
      widget.item.likeCount += widget.item.likedByMe ? 1 : -1;
    });
  }

  @override
  Widget build(BuildContext context) {
    final e = widget.item;

    Widget media;
    if (e.kind == 'image') {
      media = CachedNetworkImage(imageUrl: e.fileUrl, fit: BoxFit.cover);
    } else if (_vp != null && _vp!.value.isInitialized) {
      media = GestureDetector(
        onTap: () => setState(() =>
            _vp!.value.isPlaying ? _vp!.pause() : _vp!.play()),
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
      media = const SizedBox(
        height: 230,
        child: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(e.title),
        backgroundColor: Colors.green.shade700,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ClipRRect(borderRadius: BorderRadius.circular(14), child: media),
          const SizedBox(height: 16),
          Text(e.description, style: Theme.of(context).textTheme.bodyLarge),
          const SizedBox(height: 20),
          Row(
            children: [
              IconButton(
                icon: Icon(Icons.thumb_up,
                    color:
                        e.likedByMe ? Colors.green.shade700 : Colors.grey[500]),
                onPressed: _toggleLike,
              ),
              Text('${e.likeCount} likes',
                  style: const TextStyle(fontWeight: FontWeight.w600)),
            ],
          ),
        ],
      ),
    );
  }
}
