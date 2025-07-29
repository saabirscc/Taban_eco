// // lib/screens/stories_screen.dart
// import 'package:flutter/material.dart';
// import 'package:intl/intl.dart';  // Import for date formatting
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
//     _future = CleanupService.fetchCleanupStories(); // Fetch the cleanup stories
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
//     return ListTile(
//       leading: Image.network(
//         cleanup.beforeImages.isNotEmpty
//             ? cleanup.beforeImages.first
//             : cleanup.afterImages.first,
//         fit: BoxFit.cover,
//         width: 50,
//         height: 50,
//       ),
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
// lib/screens/stories_screen.dart
import 'package:flutter/material.dart';
import '../models/cleanup.dart';  // Add this import
import '../services/cleanup_service.dart';
import '../widgets/story_card.dart';

class StoriesScreen extends StatefulWidget {
  const StoriesScreen({Key? key}) : super(key: key);

  @override
  State<StoriesScreen> createState() => _StoriesScreenState();
}

class _StoriesScreenState extends State<StoriesScreen> {
  late Future<List<Cleanup>> _future;

  @override
  void initState() {
    super.initState();
    _refreshData();
  }

  Future<void> _refreshData() async {
    setState(() {
      _future = CleanupService.fetchCleanupStories();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cleanup Stories'),
        centerTitle: true,
        backgroundColor: Colors.green[700],
      ),
      body: RefreshIndicator(
        onRefresh: _refreshData,
        child: FutureBuilder<List<Cleanup>>(
          future: _future,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            if (snapshot.hasError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text(
                      'Failed to load stories',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${snapshot.error}',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _refreshData,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            final stories = snapshot.data ?? [];

            if (stories.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.clean_hands, size: 48, color: Colors.grey),
                    const SizedBox(height: 16),
                    Text(
                      'No cleanup stories yet',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    const Text('Be the first to create one!'),
                  ],
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: stories.length,
              itemBuilder: (context, index) => StoryCard(cleanup: stories[index]),
            );
          },
        ),
      ),
    );
  }
}