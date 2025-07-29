// // lib/screens/stories_screen.dart
// import 'package:flutter/material.dart';
// import 'package:intl/intl.dart';
// import '../models/cleanup.dart';
// import '../services/cleanup_service.dart';

// class StoriesScreen extends StatefulWidget {
//   const StoriesScreen({Key? key}) : super(key: key);

//   @override
//   State<StoriesScreen> createState() => _StoriesScreenState();
// }

// class _StoriesScreenState extends State<StoriesScreen> {
//   late Future<List<Cleanup>> _future;

//   @override
//   void initState() {
//     super.initState();
//     _future = CleanupService.fetchCleanupStories();
//   }

//   Future<void> _refresh() async {
//     setState(() => _future = CleanupService.fetchCleanupStories());
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Cleanup Stories'),
//         centerTitle: true,
//       ),
//       body: RefreshIndicator(
//         onRefresh: _refresh,
//         child: FutureBuilder<List<Cleanup>>(
//           future: _future,
//           builder: (_, snap) {
//             if (snap.connectionState == ConnectionState.waiting) {
//               return const Center(child: CircularProgressIndicator());
//             }
//             if (snap.hasError) {
//               return Center(child: Text('Error: ${snap.error}'));
//             }

//             final items = snap.data ?? [];
//             if (items.isEmpty) {
//               return const Center(child: Text('No stories yet'));
//             }

//             return ListView.separated(
//               itemCount: items.length,
//               itemBuilder: (_, i) => _StoryCard(cleanup: items[i]),
//               separatorBuilder: (_, __) => const Divider(),
//             );
//           },
//         ),
//       ),
//     );
//   }
// }

// class _StoryCard extends StatelessWidget {
//   final Cleanup cleanup;

//   const _StoryCard({Key? key, required this.cleanup}) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     String? imageUrl;
//     if (cleanup.beforeImages.isNotEmpty) {
//       imageUrl = cleanup.beforeImages.first;
//     } else if (cleanup.afterImages.isNotEmpty) {
//       imageUrl = cleanup.afterImages.first;
//     } else {
//       imageUrl = null;
//     }

//     return ListTile(
//       leading: imageUrl != null
//           ? Image.network(
//               imageUrl,
//               fit: BoxFit.cover,
//               width: 50,
//               height: 50,
//               errorBuilder: (_, __, ___) => const Icon(Icons.image_not_supported, size: 40),
//             )
//           : const Icon(Icons.image_not_supported, size: 40),
//       title: Text(cleanup.title),
//       subtitle: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Text('Location: ${cleanup.location}'),
//           Text('Date: ${cleanup.scheduledDate != null ? DateFormat.yMMMd().format(cleanup.scheduledDate!) : ''}'),
//         ],
//       ),
//     );
//   }
// }




//last
// lib/widgets/story_card.dart


import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/cleanup.dart';

/// Base URL for your backend (use your actual server URL)
const String baseUrl = "http://10.0.2.2:3000";

class StoryCard extends StatelessWidget {
  final Cleanup cleanup;

  const StoryCard({Key? key, required this.cleanup}) : super(key: key);

  String _getFullImageUrl(String imagePath) {
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
      return '$baseUrl$imagePath';
    }
    return '$baseUrl/$imagePath';
  }

  Widget _buildImageSection(String title, List<String> images) {
    if (images.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 8),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: images.map((imageUrl) {
              final fullUrl = _getFullImageUrl(imageUrl);
              return Container(
                margin: const EdgeInsets.only(right: 8),
                child: Image.network(
                  fullUrl,
                  width: 150,
                  height: 150,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    width: 150,
                    height: 150,
                    color: Colors.grey[200],
                    child: const Icon(Icons.broken_image),
                  ),
                  loadingBuilder: (_, child, progress) {
                    return progress == null
                        ? child
                        : Container(
                            width: 150,
                            height: 150,
                            color: Colors.grey[200],
                            child: const Center(child: CircularProgressIndicator()),
                          );
                  },
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              cleanup.title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.location_on, size: 16),
                const SizedBox(width: 4),
                Text(cleanup.location),
              ],
            ),
            if (cleanup.scheduledDate != null) ...[
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 16),
                  const SizedBox(width: 4),
                  Text(DateFormat.yMMMd().format(cleanup.scheduledDate!)),
                ],
              ),
            ],
            const SizedBox(height: 12),
            if (cleanup.description.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(
                  cleanup.description,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
            _buildImageSection('Before Cleanup', cleanup.beforeImages),
            _buildImageSection('After Cleanup', cleanup.afterImages),
          ],
        ),
      ),
    );
  }
}